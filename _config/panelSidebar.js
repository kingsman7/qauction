const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'iauctions.cms.sidebar.adminGroup',
    icon: 'fas fa-gavel',
    children: [
      pages.mainqauction.auctions,
      pages.mainqauction.bids
    ]
  },
]
