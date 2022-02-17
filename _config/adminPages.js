export default {
    categories: {
        permission: 'iauctions.categories.manage',
        activated: true,
        authenticated: true,
        path: '/auctions/categories/index',
        name: 'qauctions.admin.categories',
        crud : import('@imagina/qauction/_crud/categories'),
        page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
        layout: () => import('@imagina/qsite/_layouts/master.vue'),
        title: 'qauctions.sidebar.adminCategories',
        icon: 'fas fa-layer-group',
        subHeader: {
          refresh: true,
        }
      },

}
