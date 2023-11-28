export default class menus {
    static mainMenu() {
        return [
            {
                pathName: '',
                name: 'home',
                title: 'trang chủ',
                isActive: false,
                childs: [],
                params: []
            },
            {
                pathName: 'about',
                name: 'about',
                title: 'về chúng tôi',
                isActive: false,
                childs: [],
                params: []
            },
            {
                pathName: 'partner',
                name: 'partner',
                title: 'đối tác',
                isActive: false,
                childs: [],
                params: []
            },
            {
                pathName: 'warehouse',
                name: 'whService',
                title: 'dịch vụ kho',
                isActive: false,
                childs: [],
                params: [
                    {
                        paramName: 'chung',
                        title: 'kho chung'
                    },
                    {
                        paramName: 'mát',
                        title: 'kho mát'
                    },
                    {
                        paramName: 'mini',
                        title: 'kho mini'
                    },
                    {
                        paramName: 'tự-quản',
                        title: 'kho tự quản'
                    },
                    {
                        paramName: 'tài-liệu',
                        title: 'kho tài liệu'
                    },
                    {
                        paramName: 'thương-mại-điện-tử',
                        title: 'kho thương mại điện tử'
                    },
                ]
            },
            {
                pathName: 'news',
                name: 'news',
                title: 'tin tức',
                isActive: false,
                childs: [],
                params: []
            },
            {
                pathName: 'contact',
                name: 'contact',
                title: 'liên hệ',
                isActive: false,
                childs: [],
                params: []
            },
        ]
    }

    static adminMenu() {
        return [
            {
                name: 'dashboard',
                path: 'admin-dashboard'
            },
            {
                name: 'warehouses',
                path: 'admin-warehouses'
            },
            {
                name: 'users',
                path: 'admin-users'
            },
            {
                name: 'warehouses details',
                path: 'admin-warehouses-details'
            },
            {
                name: 'categories',
                path: 'admin-categories'
            },
            {
                name: 'partners',
                path: 'admin-partners'
            },
            {
                name: 'blogs',
                path: 'admin-blogs'
            },
            {
                name: 'orders',
                path: 'admin-orders'
            },
            {
                name: 'hashtags',
                path: 'admin-hashtags'
            },
            {
                name: 'contacts',
                path: 'admin-contracts'
            },
            {
                name: 'goods',
                path: 'admin-goods'
            },
            {
                name: 'request',
                path: 'admin-requests'
            },
            {
                name: 'request details',
                path: 'admin-request-details'
            },
        ]
    }
}