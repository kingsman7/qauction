const pages = config('pages') // Get Pages from config
//Blog
export default [
  {
    title: 'iauction.cms.sidebar.autions',
    icon: 'fas fa-chart-line',
    children: [
      pages.qauction.auction
    ]
  },
]
