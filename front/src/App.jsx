import { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import PageError from "./pages/ErrorPage/PageError"
import Loader from "./components/Loader/Loader"
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'

const UserList = lazy(() => import('./pages/Users/UserList'));
const UserView = lazy(()=>import('./pages/Users/UserView'))
const UserForm = lazy(()=>import('./components/Forms/UserForm'))
const Group = lazy(() => import('./pages/AccessGroup/AccessGroup'));
const Access = lazy(()=>import('./pages/AccessGroup/Access'))
const GroupView = lazy(()=>import('./pages/AccessGroup/AccessGroupView'))
const AccessGroupForm = lazy(()=>import('./components/Forms/AccessGroupForm'))
const Log = lazy(() => import('./pages/LogDisplay/Log'));
const DetailedLog = lazy(()=>import('./pages/LogDisplay/DetailedLog.jsx'))
const Secure = lazy(()=>import('./pages/LogDisplay/Secure'))
const BlackList = lazy(()=>import('./pages/LogDisplay/BlackList'))
const LogView = lazy(()=>import('./pages/LogDisplay/LogView'))
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ModuleList  = lazy(()=>import('./pages/Module/ModuleList'))
const ModuleListView = lazy(()=>import('./pages/Module/ModuleListView'))
const ModuleForm = lazy(()=>import('./components/Forms/ModuleForm'))
const RegistryList  = lazy(()=>import('./pages/Registry/RegistryList'))
const RegistryListView = lazy(()=>import('./pages/Registry/RegistryListView'))
const RegistryForm = lazy(()=>import('./components/Forms/RegistryForm'))
const DebtorList = lazy(() => import('./pages/DebtorList/DebtorList.jsx'));
const DebtorView = lazy(()=>import('./pages/DebtorList/DebtorView.jsx'))
const PrintView = lazy(()=>import('./components/Cards/PrintCard.jsx'))
const PaidServicesList = lazy(() => import('./pages/CNAP/PaidServicesList.jsx'));
const AccountsList = lazy(() => import('./pages/CNAP/AccountsList.jsx'));
const ServiceView = lazy(() => import('./pages/CNAP/ServiceView.jsx'));
const ServiceCreate = lazy(() => import('./pages/CNAP/ServiceCreate.jsx'));
const AccountView = lazy(() => import('./pages/CNAP/AccountView.jsx'));
const ServiceEdit = lazy(() => import('./pages/CNAP/ServiceEdit.jsx'));
const AccountCreate = lazy(() => import('./pages/CNAP/AccountCreate.jsx'));
const PrintCNAPView = lazy(() => import('./components/Cards/PrintCNAPCard.jsx'));
const KindergartenDebtorsList = lazy(() => import('./pages/Kindergarten/KindergartenList.jsx'))
const PrintKindergartenCardView = lazy(() => import ('./components/Cards/PrintKindergartenCard.jsx'))
const Requisite = lazy(() => import('./pages/SportsСomplex/Requisite.jsx'));
const Bills = lazy(() => import('./pages/SportsСomplex/Bills.jsx'));
const Services = lazy(() => import('./pages/SportsСomplex/Services.jsx'));
const RequisiteView = lazy(() => import('./pages/SportsСomplex/RequisiteView'));
const RequisiteEdit = lazy(() => import('./pages/SportsСomplex/RequisiteEdit'));
const SportsServiceView = lazy(() => import('./pages/SportsСomplex/ServiceView.jsx'));
const PoolServiceEdit = lazy(() => import('./pages/SportsСomplex/ServiceEdit.jsx'));
const BillDetails = lazy(() => import('./pages/SportsСomplex/BillDetails.jsx'));
const PrintBillCard = lazy(() => import('./components/Cards/PrintBillCard.jsx'));
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />}>
                    <Route index element={<Dashboard />} />
                    <Route exact path="user" element={<Suspense fallback={<Loader />}><UserList /></Suspense>} />
                    <Route path="user/:userId" element={<Suspense fallback={<Loader/>}><UserView /></Suspense>} />
                    <Route exact path="user/add" element={<Suspense fallback={<Loader/>}><UserForm /></Suspense>} />
                    <Route path="user/:userId/edit" element={<Suspense fallback={<Loader/>}><UserForm /></Suspense>} />
                    <Route exact path="group" element={<Suspense fallback={<Loader />}><Group /></Suspense>} />
                    <Route path="group/:roleId" element={<Suspense fallback={<Loader/>}><GroupView /></Suspense>} />
                    <Route exact path="group/add" element={<Suspense fallback={<Loader />}><AccessGroupForm /></Suspense>}/>
                    <Route exact path="group/:roleId/access" element={<Suspense fallback={<Loader />}><Access /></Suspense>}/>
                    <Route path="group/:roleId/edit" element={<Suspense fallback={<Loader />}><AccessGroupForm /></Suspense>}/>
                    <Route exact path="logs" element={<Suspense fallback={<Loader />}><Log /></Suspense>} />
                    <Route path="logs/:id" element={<Suspense fallback={<Loader />}><LogView /></Suspense>} />
                    <Route exact path="/reports" element={<Suspense fallback={<Loader />}><DetailedLog /></Suspense>} />
                    <Route exact path="/secure" element={<Suspense fallback={<Loader />}><Secure /></Suspense>} />
                    <Route exact path="/blacklist" element={<Suspense fallback={<Loader />}><BlackList /></Suspense>} />
                    <Route path="profile" element={<Suspense fallback={<Loader />}><Profile /></Suspense>} />
                    <Route exact path="modules" element={<Suspense fallback={<Loader />}><ModuleList /></Suspense>} />
                    <Route path="modules/:moduleId" element={<Suspense fallback={<Loader />}><ModuleListView /></Suspense>} />
                    <Route exact path="modules/add" element={<Suspense fallback={<Loader/>}><ModuleForm /></Suspense>} />
                    <Route path="modules/:moduleId/edit" element={<Suspense fallback={<Loader/>}><ModuleForm /></Suspense>} />
                    <Route exact path="registry" element={<Suspense fallback={<Loader />}><RegistryList /></Suspense>} />
                    <Route path="registry/:registryId" element={<Suspense fallback={<Loader />}><RegistryListView /></Suspense>} />
                    <Route exact path="registry/add" element={<Suspense fallback={<Loader/>}><RegistryForm /></Suspense>} />
                    <Route path="registry/:registryId/edit" element={<Suspense fallback={<Loader/>}><RegistryForm /></Suspense>} />
                    <Route exact path="debtor" element={<Suspense fallback={<Loader />}><DebtorList /></Suspense>} />
                    <Route path="debtor/:debtId" element={<Suspense fallback={<Loader/>}><DebtorView /></Suspense>} />
                    <Route path="debtor/:debtId/print" element={<Suspense fallback={<Loader/>}><PrintView /></Suspense>} />
                    <Route exact path="cnap/services" element={<Suspense fallback={<Loader />}><PaidServicesList /></Suspense>} />
                    <Route exact path="cnap/services/create" element={<Suspense fallback={<Loader />}><ServiceCreate /></Suspense>} />
                    <Route path="cnap/services/:id" element={<Suspense fallback={<Loader />}><ServiceView /></Suspense>} />
                    <Route path="cnap/services/:id/edit" element={<Suspense fallback={<Loader />}><ServiceEdit /></Suspense>} />
                    <Route exact path="cnap/accounts" element={<Suspense fallback={<Loader />}><AccountsList /></Suspense>} />
                    <Route exact path="cnap/accounts/create" element={<Suspense fallback={<Loader />}><AccountCreate /></Suspense>} />
                    <Route path="cnap/accounts/:id" element={<Suspense fallback={<Loader />}><AccountView /></Suspense>} />
                    <Route path="cnap/accounts/:debtId/print" element={<Suspense fallback={<Loader/>}><PrintCNAPView /></Suspense>}/>
                    <Route exact path="kindergarten" element={<Suspense fallback={<Loader/>}><KindergartenDebtorsList /></Suspense>} />
                    <Route exact path="kindergarten/:id/print" element={<Suspense fallback={<Loader/>}><PrintKindergartenCardView /></Suspense>} />
                    <Route exact path="details" element={<Suspense fallback={<Loader />}><Requisite /></Suspense>} />
                    <Route exact path="bills" element={<Suspense fallback={<Loader />}><Bills /></Suspense>} />
                    <Route exact path="poolservices" element={<Suspense fallback={<Loader />}><Services /></Suspense>} />
                    <Route path="requisite/:requisiteId" element={<Suspense fallback={<Loader/>}><RequisiteView /></Suspense>} />
                    <Route path="requisite/:requisiteId/edit" element={<Suspense fallback={<Loader/>}><RequisiteEdit /></Suspense>} />
                    <Route path="poolservice/:serviceId" element={<Suspense fallback={<Loader/>}><SportsServiceView /></Suspense>} />
                    <Route path="poolservice/:serviceId/edit" element={<Suspense fallback={<Loader/>}><PoolServiceEdit /></Suspense>} />
                    <Route path="/bills/:id/requisites" element={<Suspense fallback={<Loader />}><BillDetails /></Suspense>} />
                    <Route path="/bills/:id/print" element={<Suspense fallback={<Loader />}><PrintBillCard /></Suspense>} />
                    <Route path="*" element={<PageError title="Схоже, цієї сторінки не знайдено." statusError="404"/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
