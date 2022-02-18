<template>
  <div>
    <form-auction ref="formAuction"/>
    <form-bid ref="formBid"/>
  </div>
</template>
<script>
//Component
import formAuction from '@imagina/qauction/_components/formAuction'
import formBid from '@imagina/qauction/_components/formBid'

export default {
  components: {formAuction, formBid},
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    statusColor() {
      return ['text-red', 'text-green', 'text-blue']
    },
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qauction.entityNames.auction"),
        apiRoute: 'apiRoutes.qauction.auctions',
        permission: 'iauctions.auctions',
        extraFormFields: 'iauctions.crud-fields.auctions',
        create: {
          method: () => {
            this.$refs.formAuction.loadform({
              modalProps: {
                title: this.$tr('iauctions.cms.newAuction')
              }
            })
          }
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left'},
            {
              name: 'statusName', label: this.$tr('isite.cms.form.status'), field: 'statusName', align: 'left',
              classes: row => `text-weight-bold ${this.statusColor[row.status]}`
            },
            {
              name: 'creator', label: this.$tr('isite.cms.label.creator'), field: 'creator', align: 'left',
              format: val => val ? `${val.firstName} ${val.lastName}` : '-',
            },
            {
              name: 'startAt', label: this.$tr('isite.cms.form.startDate'), field: 'startAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'endAt', label: this.$tr('isite.cms.form.endDate'), field: 'endAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'typeName', label: this.$tr('isite.cms.form.type'), field: 'typeName', align: 'left'},
            {
              name: 'category', label: this.$tr('isite.cms.form.category'), field: 'category', align: 'left',
              format: val => val ? val.title : '-',
            },
            {
              name: 'department', label: this.$tr('isite.cms.label.department'), field: 'department', align: 'left',
              format: val => val ? val.title : '-',
            },
            {
              name: 'winner', label: this.$tr('isite.cms.label.winner'), field: 'winner', align: 'left',
              format: val => val ? `${val.firstName} ${val.lastName}` : '-',
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
                clearable: true,
                options: [
                  {label: this.$tr('isite.cms.label.disabled'), value: '0'},
                  {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                  {label: this.$tr('isite.cms.label.finished'), value: '2'},
                ]
              }
            },
            type: {
              value: null,
              type: 'select',
              clearable: true,
              props: {
                label: this.$tr('isite.cms.form.type'),
                options: [
                  {label: this.$tr('isite.cms.label.inverse'), value: '0'},
                  {label: this.$tr('isite.cms.label.open'), value: '1'}
                ]
              }
            },
            categoryId: {
              value: null,
              type: 'select',
              clearable: true,
              props: {
                label: this.$tr('isite.cms.form.category')
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qauction.categories'
              }
            }
          },
          requestParams: {
            include: 'category,department,winner,creator'
          },
          actions: [
            {
              name: 'bid',
              icon: 'far fa-hand-point-up',
              label: this.$tr('iauctions.cms.bidUp'),
              format: (field) => {
                return field.row.status == 1 ? {} : {vIf: false}
              },
              action: (item) => {
                this.$refs.formBid.loadform({
                  auctionId: item.id,
                  extraFormId: item.category.bidFormId,
                  modalProps: {
                    title: `${this.$tr('iauctions.cms.newBid')} | ${item.title}`
                  }
                })
              }
            }
          ]
        },
        update: false,
        delete: true
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
