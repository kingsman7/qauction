<template>
  <show-bid-data ref="showBidData"/>
</template>
<script>
//Components
import showBidData from '@imagina/qauction/_components/showBid'

export default {
  components: {showBidData},
  data() {
    return {
      crudId: this.$uid(),
      appMode : config('app.mode')
    }
  },
  computed: {
    statusColor() {
      return ['text-red', 'text-green']
    },
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qauction.entityNames.auction"),
        apiRoute: 'apiRoutes.qauction.bids',
        permission: 'iauctions.bids',
        extraFormFields: 'iauctions.crud-fields.bids',
        create: false,
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {
              name: 'auction', label: this.$tr('iauctions.cms.auction'), field: 'auction', align: 'left',
              format: val => val ? val.title : '-',
            },
            {
              name: 'provider', label: this.$tr('isite.cms.label.provider'), field: 'provider', align: 'left',
              format: val => val ? `${val.firstName} ${val.lastName}` : '-',
            },
            {
              name: 'statusName', label: this.$tr('isite.cms.form.status'), field: 'statusName', align: 'left',
              classes: row => `text-weight-bold ${this.statusColor[row.status]}`
            },
            {
              name: 'amount', label: this.$tr('isite.cms.label.amount'), field: 'amount', align: 'left',
              format: val => val ? this.$trn(val) : '-',
            },
            {
              name: 'winner', label: this.$tr('isite.cms.label.winner'), field: 'winner', align: 'left',
              format: val => parseInt(val) ? this.$tr('isite.cms.label.yes') : this.$tr('isite.cms.label.no'),
            },
            {
              name: "created_at",
              label: this.$tr("isite.cms.form.createdAt"),
              field: "createdAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            {
              name: "updated_at",
              label: this.$tr("isite.cms.form.updatedAt"),
              field: "updatedAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          filters: {
            status: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.status'),
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qauction.statusBid',
                select: {label: 'name', id: 'value'}
              }
            }
          },
          requestParams: {
            filter: this.appMode == 'iadmin' ? {} : {providerId: this.$store.state.quserAuth.userId},
            include: 'provider,auction.category,fields'
          },
          actions: [
            {
              name: 'show',
              icon: 'far fa-eye',
              label: this.$tr('isite.cms.label.show'),
              action: (item) => {
                this.$refs.showBidData.showBidData(item)
              }
            }
          ]
        },
        update: false,
        delete: false
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  }
}
</script>
