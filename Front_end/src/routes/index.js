import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import * as FeatherIcon from 'react-feather';

import * as authUtils from '../helpers/authUtils';

// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const PasswordChange = React.lazy(() => import('../pages/auth/PasswordChange'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const Confirm = React.lazy(() => import('../pages/auth/Confirm'));
// dashboard
const Dashboard = React.lazy(() => import('../pages/dashboard'));
// user
const UserCreate = React.lazy(() => import('../pages/user/Create'));
const UserUpdate = React.lazy(() => import('../pages/user/Update'));
const UserActive = React.lazy(() => import('../pages/user/Active'));
const UserInActive = React.lazy(() => import('../pages/user/InActive'));
// Customer
const ClientProcessing = React.lazy(() => import('../pages/client/ByLoanCondition/Processing'));
const ClientNotProcessing = React.lazy(() => import('../pages/client/ByLoanCondition/NotProcessing'));
const ClientConditional = React.lazy(() => import('../pages/client/ByLoanCondition/Conditional'));
const ClientApproved = React.lazy(() => import('../pages/client/ByLoanCondition/Approved'));
const ClientSettled = React.lazy(() => import('../pages/client/ByLoanCondition/Settled'));
const ClientDisbursed = React.lazy(() => import('../pages/client/ByLoanCondition/Declined'));
const ClientCreate = React.lazy(() => import('../pages/client/Create'));
const ClientUpdate = React.lazy(() => import('../pages/client/Update'));
const ClientHomeLoan = React.lazy(() => import('../pages/client/ByLoanType/HomeLoan'));
const ClientCarLoan = React.lazy(() => import('../pages/client/ByLoanType/CarLoan'));
const ClientBusinessLoan = React.lazy(() => import('../pages/client/ByLoanType/BusinessLoan'));
const ClientPersonalLoan = React.lazy(() => import('../pages/client/ByLoanType/PersonalLoan'));
const ClientRefinance = React.lazy(() => import('../pages/client/ByLoanType/Refinance'));
const ClientDetails = React.lazy(() => import('../pages/client/Details'));
const ClientsByPriority = React.lazy(() => import('../pages/client/ByPriority'));

// Appoinment
const AppoinmentIndex = React.lazy(() => import('../pages/appoinment/Index'));
const AppoinmentCreate = React.lazy(() => import('../pages/appoinment/Create'));
const AppoinmentUpdate = React.lazy(() => import('../pages/appoinment/Update'));

// Reports
const SettledAmount = React.lazy(() => import('../pages/report/SettledAmount'));
// apps
const EmailCompose = React.lazy(() => import('../pages/apps/Email/Compose'));

// handle auth and authorization
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (!authUtils.isUserAuthenticated()) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
            }

            const loggedInUser = authUtils.getUser();
            // check if route is restricted by role
            if (roles && roles.indexOf(loggedInUser.role) === -1) {
                // role not authorised so redirect to home page
                return <Redirect to={{ pathname: '/' }} />;
            }

            // authorised so return component
            return <Component {...props} />;
        }}
    />
);

// root routes
const rootRoute = {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashboard" />,
    route: PrivateRoute,
};

// dashboards
const dashboardRoutes = {
    path: '/dashboard',
    name: 'Dashboard',
    icon: FeatherIcon.Home,
    header: 'Navigation',
    badge: {
        variant: 'success',
        // text: '1',
    },
    component: Dashboard,
    roles: ['SuperAdmin','Admin','Officer'],
    route: PrivateRoute
};

// apps

// const calendarAppRoutes = {
//     path: '/apps/calendar',
//     name: 'Calendar',
//     header: 'Apps',
//     icon: FeatherIcon.Calendar,
//     component: CalendarApp,
//     route: PrivateRoute,
//     roles: ['Admin'],
// };

const userRoutes = {
    path: '/user',
    name: 'Users',
    icon: FeatherIcon.User,
    children: [
        {
            path: '/user/create',
            name: 'Create New User',
            component: UserCreate,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin']
        },
        {
            path: '/user/index',
            name: 'Users List',
            children: [
                {
                    path: '/user/index/active',
                    name: 'Active User',
                    component: UserActive,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin']
                },
                {
                    path: '/user/index/inactive',
                    name: 'InActive User',
                    component: UserInActive,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin']
                }
            ]
        }
    ]
};

const clientRoutes = {
    path: '/client',
    name: 'Clients',
    icon: FeatherIcon.CheckSquare,
    children: [
        {
            path: '/client/create',
            name: 'New Client Register',
            component: ClientCreate,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
        {
            path: '/client/ByPriority',
            name: 'By Priority',
            component: ClientsByPriority,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
        {
            path: '/client/ByLoanType/',
            name: 'By Loan Type',
            roles: ['SuperAdmin','Admin','Officer'],
            children: [
                {
                    path: '/client/ByLoanType/HomeLoan',
                    name: 'Home Loan',
                    component: ClientHomeLoan,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanType/CarLoan',
                    name: 'Car Loan',
                    component: ClientCarLoan,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanType/BusinessLoan',
                    name: 'Business Loan',
                    component: ClientBusinessLoan,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanType/PersonalLoan',
                    name: 'Personal Loan',
                    component: ClientPersonalLoan,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanType/Refinance',
                    name: 'Refinance',
                    component: ClientRefinance,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                }
            ]
        },
        {
            path: '/client/ByLoanCondition',
            name: 'By Loan Condition',
            roles: ['SuperAdmin','Admin','Officer'],
            children: [
                {
                    path: '/client/ByLoanCondition/processing',
                    name: 'Processing',
                    component: ClientProcessing,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanCondition/notProcessing',
                    name: 'Not Processing',
                    component: ClientNotProcessing,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanCondition/conditional',
                    name: 'Conditional',
                    component: ClientConditional,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanCondition/approved',
                    name: 'Approved',
                    component: ClientApproved,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanCondition/disbursed',
                    name: 'Declined',
                    component: ClientDisbursed,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                },
                {
                    path: '/client/ByLoanCondition/settled',
                    name: 'Settled',
                    component: ClientSettled,
                    route: PrivateRoute,
                    roles: ['SuperAdmin','Admin','Officer'],
                }
            ]
        }
    ]
};

const appoinmentRoutes = {
    path: '/appoinment',
    name: 'Appoinments',
    icon: FeatherIcon.Info,
    children: [
        {
            path: '/appoinment/create',
            name: 'Appoinment Update',
            component: AppoinmentCreate,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
        {
            path: '/appoinment/index',
            name: 'Appoinment List',
            component: AppoinmentIndex,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        }
    ]
};

const emailAppRoutes = {
    path: '/apps/email',
    name: 'Emails',
    icon: FeatherIcon.Inbox,
    children: [
        // {
        //     path: '/apps/email/inbox',
        //     name: 'Inbox',
        //     component: EmailInbox,
        //     route: PrivateRoute,
        //     roles: ['SuperAdmin','Admin','Officer']
        // },
        // {
        //     path: '/apps/email/details',
        //     name: 'Details',
        //     component: EmailDetail,
        //     route: PrivateRoute,
        //     roles: ['SuperAdmin','Admin','Officer']
        // },
        {
            path: '/apps/email/compose',
            name: 'Compose',
            component: EmailCompose,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer']
        },
    ]
};

const reportRoutes = {
    path: '/report',
    name: 'Reports',
    icon: FeatherIcon.Paperclip,
    children: [
        // {
        //     path: '/apps/email/inbox',
        //     name: 'Inbox',
        //     component: EmailInbox,
        //     route: PrivateRoute,
        //     roles: ['SuperAdmin','Admin','Officer']
        // },
        // {
        //     path: '/apps/email/details',
        //     name: 'Details',
        //     component: EmailDetail,
        //     route: PrivateRoute,
        //     roles: ['SuperAdmin','Admin','Officer']
        // },
        {
            path: '/report/settledAmount',
            name: 'Settled Amount',
            component: SettledAmount,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer']
        },
    ]
};

// const projectAppRoutes = {
//     path: '/apps/projects',
//     name: 'Projects',
//     icon: FeatherIcon.Briefcase,
//     children: [
//         {
//             path: '/apps/projects/list',
//             name: 'List',
//             component: ProjectList,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/projects/detail',
//             name: 'Detail',
//             component: ProjectDetail,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ]
// };

// const taskAppRoutes = {
//     path: '/apps/tasks',
//     name: 'Tasks',
//     icon: FeatherIcon.Bookmark,
//     children: [
//         {
//             path: '/apps/tasks/list',
//             name: 'List',
//             component: TaskList,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/tasks/board',
//             name: 'Board',
//             component: TaskBoard,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ],
// };

// const appRoutes = [calendarAppRoutes, emailAppRoutes, projectAppRoutes, taskAppRoutes];


// pages
// const pagesRoutes = {
//     path: '/pages',
//     name: 'Pages',
//     header: 'Custom',
//     icon: FeatherIcon.FileText,
//     children: [
//         {
//             path: '/pages/starter',
//             name: 'Starter',
//             component: Starter,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/profile',
//             name: 'Profile',
//             component: Profile,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/activity',
//             name: 'Activity',
//             component: Activity,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/invoice',
//             name: 'Invoice',
//             component: Invoice,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/pricing',
//             name: 'Pricing',
//             component: Pricing,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/error-404',
//             name: 'Error 404',
//             component: Error404,
//             route: Route
//         },
//         {
//             path: '/pages/error-500',
//             name: 'Error 500',
//             component: Error500,
//             route: Route
//         },
//     ]
// };


// components

// const componentsRoutes = {
//     path: '/ui',
//     name: 'UI Elements',
//     header: 'Components',
//     icon: FeatherIcon.Package,
//     children: [
//         {
//             path: '/ui/bscomponents',
//             name: 'Bootstrap UI',
//             component: BSComponents,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/ui/icons',
//             name: 'Icons',
//             children: [
//                 {
//                     path: '/ui/icons/feather',
//                     name: 'Feather Icons',
//                     component: FeatherIcons,
//                     route: PrivateRoute,
//                     roles: ['Admin'],
//                 },
//                 {
//                     path: '/ui/icons/unicons',
//                     name: 'Unicons Icons',
//                     component: UniconsIcons,
//                     route: PrivateRoute,
//                     roles: ['Admin'],
//                 },
//             ]
//         },
//         {
//             path: '/ui/widgets',
//             name: 'Widgets',
//             component: Widgets,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },

//     ]
// };

// charts

// const chartRoutes = {
//     path: '/charts',
//     name: 'Charts',
//     component: Charts,
//     icon: FeatherIcon.PieChart,
//     roles: ['Admin'],
//     route: PrivateRoute
// }

// -- / auth / -- / -- / -- / -- / -- / -- / -- / -- /

const authRoutes = {
    path: '/account',
    name: 'Auth',
    children: [
        {
            path: '/account/login',
            name: 'Login',
            component: Login,
            route: Route,
            roles: ['SuperAdmin','Admin','Officer']
        },
        {
            path: '/account/logout',
            name: 'Logout',
            component: Logout,
            route: Route,
            roles: ['SuperAdmin','Admin','Officer']
        },
        {
            path: '/account/passwordChange',
            name: 'Register',
            component: PasswordChange,
            route: Route,
            roles: ['SuperAdmin','Admin','Officer']
        },
        {
            path: '/account/confirm',
            name: 'Confirm',
            component: Confirm,
            route: Route,
            roles: ['SuperAdmin','Admin','Officer']
        },
        {
            path: '/account/forget-password',
            name: 'Forget Password',
            component: ForgetPassword,
            route: Route,
            roles: ['SuperAdmin','Admin','Officer']
        },
    ],
};


// Not Visible
const notVisibleRoutes = {
    path: '',
    name: '',
    children: [
        // {
        //     path: '/client/index/:loanConditionId',
        //     name: 'Client',
        //     component: ClientIndex,
        //     route: PrivateRoute,
        //     roles: ['SuperAdmin','Admin','Officer'],
        // },
        {
            path: '/client/update/:id',
            name: 'Update Client',
            component: ClientUpdate,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
        {
            path: '/user/update/:id',
            name: 'Update User',
            component: UserUpdate,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin']
        },
        {
            path: '/appoinment/update/:id',
            name: 'Update Appoinment',
            component: AppoinmentUpdate,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
        {
            path: '/appoinment/index/:date',
            name: 'Appoinment List By Date',
            component: AppoinmentIndex,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
        {
            path: '/client/details/:id',
            name: 'Client Details',
            component: ClientDetails,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
        {
            path: '/client/ByPriorityId/:priorityId',
            name: 'By PriorityId',
            component: ClientsByPriority,
            route: PrivateRoute,
            roles: ['SuperAdmin','Admin','Officer'],
        },
    ],
};

// flatten the list of all nested routes
const flattenRoutes = routes => {
    let flatRoutes = [];

    routes = routes || [];
    routes.forEach(item => {
        flatRoutes.push(item);
        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

// All routes

const Routes = [
    rootRoute,
    dashboardRoutes,
    userRoutes,
    clientRoutes,
    emailAppRoutes,
    reportRoutes,
    authRoutes,
    notVisibleRoutes,
    appoinmentRoutes
];

var authProtectedRoutes = [];

const roleName=authUtils.getRole();
if(roleName==="Admin" || roleName==="SuperAdmin"){
    authProtectedRoutes=[dashboardRoutes, userRoutes, clientRoutes,appoinmentRoutes,emailAppRoutes,reportRoutes];
}
else if(roleName==="Officer")
{
    authProtectedRoutes=[dashboardRoutes, clientRoutes,appoinmentRoutes,emailAppRoutes,reportRoutes];
}else
{
    authProtectedRoutes=[dashboardRoutes];
}
    
const allRoutes = flattenRoutes(Routes);

export { authProtectedRoutes, allRoutes };
