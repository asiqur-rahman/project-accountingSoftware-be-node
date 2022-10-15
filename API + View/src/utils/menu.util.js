const enumm = require('./enum.utils');
const role=enumm.role;

exports.Routes = [{
    path: '/portal-get-dashboard',
    name: '<%=translation.Dashboard%>',
    icon: 'uil-home-alt',
    header: 'Navigation',
    badge: {
        text: 'Full Details',
    },
    roles: [role.SuperUser,role.Admin,role.Employee]
},
{
    path: null,
    name: '<%=translation.Layouts%>',
    icon: 'uil-window-section',
    roles: [role.Admin,role.Employee],
    children: [
        {
            path: null,
            name: '<%=translation.Vertical%>',
            roles: ['SuperAdmin','Admin'],
            children: [
                {
                    path: '/portal-layouts-dark-sidebar',
                    name: '<%=translation.Dark_Sidebar%>',
                    roles: ['SuperAdmin','Admin']
                }
            ]
        },
        {
            path: null,
            name: '<%=translation.Horizontal%>',
            children: [
                {
                    path: '/portal-layouts-horizontal',
                    name: '<%=translation.Horizontal%>',
                    roles: ['SuperAdmin','Admin']
                },
                {
                    path: '/user/index/inactive',
                    name: 'InActive User',
                    roles: ['SuperAdmin','Admin']
                }
            ]
        }
    ]
}

];


