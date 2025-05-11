
const { updateDataMissingError } = require("./messages");
const fs = require('fs')
const fsPromise = require('fs/promises')

const paginate = (page, limit) => {
    const offset = (page - 1) * limit;
    return { offset };
};

const paginationData = (result, page, limit) => {
    const { count, data } = result;
    const totalPages = Math.ceil(count / limit);
    return { totalItems: count, items: data, totalPages, currentPage: page };
};

const filterRequestBody = (requestBody) => {
    if (!Object.keys(requestBody).length) {
        throw new Error(updateDataMissingError);
    }
    return Object.keys(requestBody)
        .reduce((acc, key) => {
            let value = requestBody[key];
            if (typeof value === 'string' && value.trim() !== '') {
                value = value.replace(/\s\s+/g, ' ');
            }
            return { ...acc, [key]: value || typeof value === 'boolean' ? value : null };
        }, {});
}

const filterData = (object, array) => {
    const filteredObject = {};

    for (const key of array) {
        if (object.hasOwnProperty(key)) {
            filteredObject[key] = object[key];
        }
    }

    return filteredObject;
};

function isValidDate(dateString) {
    const regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if (!regex_date.test(dateString)) {
        return false;
    }

    const parts = dateString.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);

    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
        return false;
    }

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    return day > 0 && day <= monthLength[month - 1];
}
const debtCols = [
    'non_residential_debt',
    'residential_debt',
    'land_debt',
    'orenda_debt',
    'mpz',
  ];

const buildWhereCondition = (whereConditions) => {
    const values = []
    
    const conditions = Object.keys(whereConditions).map(key => {
          /* 🔹 ПОШУК ЗА ЧАСТИНОЮ СУМИ */
    if (key === 'debt_amount') {
      const search = `%${whereConditions[key]}%`;   // ➜ '%639%'
      // будуємо   col::text ILIKE ?  OR …
      const likeBlock = debtCols
        .map(col => `${col}::text ILIKE ?`)
        .join(' OR ');
      // треба стільки ж параметрів, скільки колонок
      values.push(...Array(debtCols.length).fill(search));
      return `(${likeBlock})`;
    }
        if (typeof whereConditions[key] === 'string' && whereConditions[key].includes(',')) {
            const splitData = whereConditions[key].split(',')
            values.push(splitData)
            return `${key} = any (array[?::text[]])`
        }
        else if (typeof whereConditions[key] === 'string' && whereConditions[key].includes('_')) {
            const [date1, date2] = whereConditions[key].split('_')
            values.push(date1, date2)
            return `${key} BETWEEN ? AND ?`
        }
        else {
            values.push(whereConditions[key])
            return `${key} = ?`
        }
    });
    return {
        text: ' and ' + conditions.join(' and '),
        value: values,
    }
}

const isOpenFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (err) {
                resolve(false)
            }
            resolve(true)
        })
    })
}

const removeFolder = async (path) => {
    try {
        await fsPromise.access(path)
        await fsPromise.rm(path, { recursive: true, force: true })
        return true
    }
    catch (e) {
        return false
    }
}

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const removeAfterLastSlash = (str) => {
    const lastSlashIndex = str?.lastIndexOf('/');
    return lastSlashIndex !== -1 ? str?.substring(0, lastSlashIndex) : str;
}

const addRequisiteToLandDebt = (body, requisite) => {
    const land_debt = [];

    const addDebtInfo = (debtText, requisiteText, recipientName, edrpou, account, code) => {
        land_debt.push(
            [
                {
                    debtText,
                    requisiteText,
                    table: [
                        {
                            label: "Отримувач",
                            value: removeAfterLastSlash(recipientName),
                        },
                        {
                            label: "Код отримувача (ЄДРПОУ)",
                            value: edrpou,
                        },
                        {
                            label: "Банк отримувача",
                            value: 'Казначейство України',
                        },
                        {
                            label: "Номер рахунку (IBAN)",
                            value: account,
                        },
                        {
                            label: "Код класифікації доходів бюджету",
                            value: code,
                        }
                    ]
                }
            ]
        )
    };

    if (body?.non_residential_debt > 0) {
        addDebtInfo(
            `заборгованість по податку на нерухоме майно, відмінне від земельної ділянки, сплаченого фізичними особами, які є власниками об'єктів нежитлової нерухомості в сумі ${body.non_residential_debt} грн.`,
            "Реквізити для оплати :",
            requisite.non_residential_debt_recipientname,
            requisite.non_residential_debt_edrpou,
            requisite.non_residential_debt_account,
            '18010300');
    }

    if (body?.residential_debt > 0) {
        addDebtInfo(
            `заборгованість по податку на нерухоме майно, відмінне від земельної ділянки, сплачений фізичними особами, які є власниками об'єктів житлової нерухомості в сумі ${body.residential_debt} грн.`,
            "Реквізити для оплати :",
            requisite.residential_debt_recipientname,
            requisite.residential_debt_edrpou,
            requisite.residential_debt_account,
            '18010200');
    }

    if (body?.land_debt > 0) {
        addDebtInfo(
            `заборгованість по земельному податку з фізичних осіб в сумі ${body.land_debt} грн.`,
            "Реквізити для оплати :",
            requisite.land_debt_recipientname,
            requisite.land_debt_edrpou,
            requisite.land_debt_account,
            '18010700');
    }

    if (body?.orenda_debt > 0) {
        addDebtInfo(
            `заборгованість по оренді землі з фізичних осіб в сумі ${body.orenda_debt} грн.`,
            "Реквізити для оплати :",
            requisite.orenda_debt_recipientname,
            requisite.orenda_debt_edrpou,
            requisite.orenda_debt_account,
            '18010900');
    }

    if (body?.mpz > 0) {
        addDebtInfo(
            `заборгованість по мінімальньному податковому забов'язанню з фізичних осіб в сумі ${body.mpz} грн.`,
            "Реквізити для оплати :",
            requisite.mpz_recipientname,
            requisite.mpz_edrpou,
            requisite.mpz_account,
            '11011300');
    }

    return land_debt;
};
const addRequisiteToAdminServiceDebt = (account, service) => {
    const admin_service_debt = [];
  
    const addDebtInfo = (debtText, requisiteText, serviceName, edrpou, iban, code,account_number) => {
      admin_service_debt.push([
        {
          debtText,
          requisiteText,
          table: [
            { label: "Номер рахунку", value: account_number        },
            { label: "Послуга",                         value: serviceName },
            { label: "Код отримувача (ЄДРПОУ)",         value: edrpou      },
            { label: "Номер рахунку (IBAN)",             value: iban        },
            { label: "Код класифікації доходів бюджету", value: code        }
          ]
        }
      ]);
    };
  
    if (account.amount > 0) {
      addDebtInfo(
        `Заборгованість по адміністративній послузі "${service.name}" в сумі ${account.amount} грн.`,
        "Реквізити для оплати:",
        service.name,
        service.edrpou,
        service.iban,
        service.identifier,
        account.account_number     
      );
    }
  
    return admin_service_debt;
  };

module.exports = {
    paginate,
    paginationData,
    filterRequestBody,
    filterData,
    isValidDate,
    buildWhereCondition,
    isOpenFile,
    removeFolder,
    formatDate,
    removeAfterLastSlash,
    addRequisiteToLandDebt,
    addRequisiteToAdminServiceDebt
}

