const displayFieldsLogs = ['action', 'schema_name', 'table_name', 'session_user_name', 'client_addr', 'client_port', 'application_name',
    'transaction_id', 'action_stamp_tx', 'changed_fields', 'row_pk_id']
const displayFieldsUsers = ['users_id', 'access_group_name', 'access_group', 'username', 'first_name', 'last_name', 'middle_name', 'email', 'phone', 'is_active']
const displayInfoUsers = ['users_id', 'username', 'access_group', 'first_name', 'last_name', 'middle_name', 'email', 'phone', 'is_active', 'ip_address']
const displayUserProfileFields = ['first_name', 'last_name', 'middle_name', 'email', 'phone', 'is_active', 'username']
const displayAccessGroupFields = ['id', 'access_group_name', 'info', 'enabled', 'create_date', 'editor_date', 'permission']
const displayBlackListFields = ['id', 'ip', 'create_date', 'agent', 'details']
const displayModuleFields = ['module_id', 'module', 'module_name', 'install_version', 'author', 'enabled', 'module_status', 'info', 'ord', 'schema_name', 'last_version', 'prev_version']
const displayRegistryFields = ['doct_id', 'title', 'enabled', 'module', 'info', 'name', 'ord']
const displayDebtorFields = ['id', 'name', 'date', 'non_residential_debt', 'residential_debt', 'land_debt', 'orenda_debt', 'identification', 'mpz']
const displayKindergardenFields = ['id', 'child_name', 'date', 'group_number','kindergarden_name','debt_amount']

const allowedUserTableFilterFields = ['is_active', 'access_group']
const allowedLogTableFilterFields = ['action', 'uid', 'action_stamp_tx', 'access_group_id']
const allowedSecureLogTableFilterFields = ['action', 'uid', 'date_add', 'ip']
const allowedBlackListTableFilterFields = ['create_date', 'ip']
const allowedModuleTableFilterFields = ['module_name']
const allowedRegistryTableFilterFields = ['name', 'module']
const allowedDebtorTableFilterFields = ['identification','debt_amount']
const allowedKindergardenTableFilterFields = ['child_name']

const allowInsertOrUpdateModuleFields = ['module', 'module_name', 'install_version', 'author', 'schema_name', 'info', 'enabled', 'ord', 'module_status', 'icon']
const allowInsertOrUpdateRegistryFields = ['title', 'enabled', 'module', 'info', 'name', 'ord']

const allowUserProfileUpdateFields = ['first_name', 'last_name', 'middle_name', 'email', 'phone', 'is_active', 'password']
const allowRoleUpdateFields = ['access_group_name', 'info', 'enabled', 'permission']
const allowBlackListUpdate = ['ip', 'details', 'agent']
const allowedDetailedLogFields = ['action_stamp_tx', 'uid']
const allowedRequisitesFilterFields = ['kved', 'iban', 'edrpou'];
const allowedServicesFilterFields = ['name', 'unit'];
const allowedBillsFilterFields = ['account_number', 'payer', 'service_name', 'status'];
//const allowedDetailedLogFields = ['year', 'month']
const itemsPerPage = [16, 32, 48];

const redisClientConfig = {
    password: process.env.REDIS_PASSWORD,
    ttl: process.env.REDIS_TTL || 60 * 60 * 1  //1hour
};
const cookieSettings = {
    httpOnly: true,
    maxAge: redisClientConfig.ttl,
    sameSite: 'strict',
    secure: true,
};

const allowedHeaders = ['Content-Type']
const exposedHeaders = ['Content-Disposition']

const accessLevel = {
    VIEW: 'VIEW',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    INSERT: 'INSERT',
}

const delayRequest = async (sec) => {
    if (typeof sec !== 'number') throw new Error('параметр min має бути числом')
    await new Promise(resolve => setTimeout(resolve, 1000 * sec))
}
const phoneReg = /^(\+?\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
const passwordReg = /^(?=.{8})(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)[a-zA-Z\d]+$/

const territory_title = "Давидівська сільська рада"
const territory_title_instrumental = "Давидівської сільської територіальної громади"
const website_name = "Портал місцевих податків Давидівської громади"
const website_url = "https://davydiv.skydatagroup.com/"
const telegram_name = "Місцеві податки Давидівської ТГ"
const telegram_url = "https://t.me/Davydiv_taxes_bot" 
const phone_number_GU_DPS = "(032) 297-30-51" 

module.exports = {
    delayRequest,
    accessLevel,
    cookieSettings,
    redisClientConfig,
    allowedHeaders,
    exposedHeaders,
    displayFieldsUsers,
    displayInfoUsers,
    displayUserProfileFields,
    displayAccessGroupFields,
    displayBlackListFields,
    displayModuleFields,
    displayRegistryFields,
    displayDebtorFields,
    displayKindergardenFields,
    displayFieldsLogs,
    allowedUserTableFilterFields,
    allowUserProfileUpdateFields,
    allowRoleUpdateFields,
    allowInsertOrUpdateModuleFields,
    allowInsertOrUpdateRegistryFields,
    allowedLogTableFilterFields,
    allowedSecureLogTableFilterFields,
    allowedBlackListTableFilterFields,
    allowedDebtorTableFilterFields,
    allowedKindergardenTableFilterFields,
    allowBlackListUpdate,
    allowedModuleTableFilterFields,
    allowedRegistryTableFilterFields,
    allowedDetailedLogFields,
    allowedRequisitesFilterFields,
    allowedServicesFilterFields,
    allowedBillsFilterFields,
    itemsPerPage,
    phoneReg,
    passwordReg,
    territory_title,
    territory_title_instrumental,
    website_name,
    website_url,
    telegram_name,
    telegram_url,
    phone_number_GU_DPS,
}