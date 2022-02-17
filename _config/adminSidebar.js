const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'iauctions.cms.sidebar.adminGroup',
    icon: 'fab fa-blogger',
    children: [
      pages.qauction.auctions,
      pages.qauction.categories,
    ]
  },
]
