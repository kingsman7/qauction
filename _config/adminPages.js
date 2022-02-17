export default {
    auction: {
        permission: 'iauctions.auctions.manage',
        activated: true,
        authenticated: true,
        path: '/auctions/auctions/index',
        name: 'qauctions.admin.auctions',
        crud : import('@imagina/qauction/_crud/auctions'),
        page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
        layout: () => import('@imagina/qsite/_layouts/master.vue'),
        title: 'iauctions.cms.sidebar.auctions',
        icon: 'fas fa-layer-group',
        subHeader: {
          refresh: true,
        }
    },
}
