<template>
  <div>
    <!--Form auction-->
    <form-auction ref="formAuction"/>
    <!--Form bid-->
    <form-bid ref="formBid"/>
    <!--Show Auction-->
    <master-modal id="showAuctionModal" v-model="modal.show" :loading="modal.loading"
                  :title="modal.title" custom-position>
      <!--Tabs panel-->
      <q-tabs v-model="modal.tab" dense class="box box-auto-height text-grey q-mb-md"
              active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
        <q-tab name="form" :label="$tr('isite.cms.label.information')"/>
        <q-tab name="bids" :label="$trp('iauctions.cms.bid')"/>
      </q-tabs>

      <!--Tabs panel-->
      <q-tab-panels v-model="modal.tab" animated keep-alive>
        <!--form Tab-->
        <q-tab-panel name="form" class="box box-auto-height q-pa-none">
          <q-list separator dense>
            <q-item v-for="(item, itemKey) in modal.data" :key="itemKey" style="padding: 8px 0">
              <q-item-section>
                <q-item-label v-if="item.fieldType != 'media'">{{ item.label }}</q-item-label>
                <!--File preview-->
                <q-item-label v-if="item.fieldType == 'media'">
                  <file-list v-model="item.value" grid-col-class="col-12" hide-header/>
                </q-item-label>
                <!--value-->
                <q-item-label v-else caption v-html="item.value"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
        <!--bids Tab-->
        <q-tab-panel name="bids" class="q-pa-none">
          <crud :crud-data="import('@imagina/qauction/_crud/bids')" :custom-data="customCrudBid"/>
        </q-tab-panel>
      </q-tab-panels>
    </master-modal>
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
      crudId: this.$uid(),
      showItemData: null,
      modal: {
        loading: false,
        show: false,
        title: null,
        data: [],
        tab: 'form'
      }
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
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left'},
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
            include: 'category,department,winner,creator,fields'
          },
          actions: [
            {
              name: 'show',
              icon: 'far fa-eye',
              label: this.$tr('isite.cms.label.show'),
              action: (item) => {
                this.showItemData = item
                this.showAuctionData(item)
              }
            },
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
        delete: false
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
    //Custom crud bid
    customCrudBid() {
      return {
        read: {
          noFilter: true,
          requestParams: {
            filter: {auctionId: this.showItemData?.id},
            include: 'provider,auction.category,winner,fields'
          },
          actions: [
            {
              name: 'mark as winner',
              icon: 'fas fa-trophy',
              label: this.$tr('iauctions.cms.setAsWinner'),
              action: (item) => {
                console.warn('Do something...')
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    //Fields to show
    async showAuctionData(itemData) {
      //Set modal data
      this.modal = {
        title: `${this.$tr('iauctions.cms.auction')} Id: ${itemData.id}`,
        show: true,
        tab: 'form',
        data: [
          {label: this.$tr('isite.cms.form.title'), value: itemData.title},
          {label: this.$tr('isite.cms.form.status'), value: itemData.statusName},
          {
            label: this.$tr('isite.cms.label.creator'),
            value: itemData.creator ? `${itemData.creator.firstName} ${itemData.creator.lastName}` : '-'
          },
          {label: this.$tr("isite.cms.form.startDate"), value: this.$trd(itemData.startAt)},
          {label: this.$tr("isite.cms.form.endDate"), value: this.$trd(itemData.endAt)},
          {label: this.$tr('isite.cms.form.type'), value: itemData.typeName},
          {label: this.$tr('isite.cms.form.category'), value: itemData.category.title},
          {label: this.$tr('isite.cms.label.department'), value: itemData.department.title},
          {
            label: this.$tr('isite.cms.label.winner'),
            value: itemData.winner ? `${itemData.winner.firstName} ${itemData.winner.lastName}` : '-'
          },
          {label: this.$tr('isite.cms.label.description'), value: itemData.description},
          {label: this.$tr("isite.cms.form.createdAt"), value: this.$trd(itemData.createdAt)},
          {label: this.$tr("isite.cms.form.updatedAt"), value: this.$trd(itemData.updatedAt)}
        ]
      }

      //Get form data
      let formId = itemData.category && itemData.category.auctionFormId ?
          itemData.category.auctionFormId : false

      //Merge values
      if (formId) {
        this.modal.loading = true
        //Get field values
        let requestValues = {}
        itemData.fields.forEach(item => requestValues[item.name] = item.value)
        //get files
        let files = this.$clone(itemData.files || [])
        //Request data
        let requestFormParams = {refresh: true, params: {include: 'fields'}}
        //Get form
        this.$crud.show('apiRoutes.qform.forms', formId, requestFormParams).then(response => {
          this.$clone(response.data.fields).forEach(field => {
            let fieldType = field.dynamicField?.type || 'input'//get field type
            let fieldValue = requestValues[this.$helper.convertStringToSnakeCase(field.name)] || '-'//get field value
            //Get field file
            let fieldFile = (fieldType != 'media') ? null :
                files.find(item => item.zone == (field.dynamicField.props.zone || 'mainimage'))

            //Add extra data to field
            this.modal.data.push({
              ...field,
              label: field.label.replace('*', ''),
              value: (fieldType != 'media') ? fieldValue : [{
                id: this.$uid(),
                ...fieldFile,
                filename: field.label,
              }],
              fieldType: fieldType
            })
          })

          this.modal.loading = false
        }).catch(error => {
          this.modal.loading = false
        })
      }
    }
  }
}
</script>
<style lang="stylus">
#showAuctionModal
  .q-tab-panels
    background transparent

</style>
