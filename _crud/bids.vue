<template>
  <master-modal v-model="modal.show" :loading="modal.loading"
                :title="modal.title" custom-position>
    <div class="box">
      <q-list separator dense>
        <q-item v-for="(item, itemKey) in modal.data" :key="itemKey" style="padding: 8px 0">
          <q-item-section>
            <q-item-label v-if="item.fieldType != 'media'">{{ item.label }}</q-item-label>
            <!--File preview-->
            <q-item-label v-if="item.fieldType == 'media'">
              <file-list v-model="item.value" grid-col-class="col-12" hide-header/>
            </q-item-label>
            <!--value-->
            <q-item-label v-else caption>{{ item.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </master-modal>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      crudId: this.$uid(),
      modal: {
        loading: false,
        show: false,
        title: null,
        data: []
      }
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
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qauction.statusBid',
                select: {label: 'name', id: 'value'}
              }
            }
          },
          requestParams: {
            include: 'provider,auction.category,winner,fields'
          },
          actions: [
            {
              name: 'show',
              icon: 'far fa-eye',
              label: this.$tr('isite.cms.label.show'),
              action: (item) => {
                this.showBidData(item)
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
  },
  methods: {
    //Fields to show
    async showBidData(bidData) {
      //Set modal data
      this.modal = {
        title: `${this.$tr('iauctions.cms.bid')} Id: ${bidData.id}`,
        show: true,
        data: [
          {label: this.$tr('iauctions.cms.auction'), value: bidData.auction.title},
          {
            label: this.$tr('isite.cms.label.provider'),
            value: bidData.provider ? `${bidData.provider.firstName} ${bidData.provider.lastName}` : '-'
          },
          {label: this.$tr('isite.cms.form.status'), value: bidData.statusName},
          {label: this.$tr('isite.cms.label.amount'), value: this.$trn(bidData.amount)},
          {
            label: this.$tr('isite.cms.label.winner'),
            value: bidData.winner ? `${bidData.winner.firstName} ${bidData.winner.lastName}` : '-'
          },
          {label: this.$tr("isite.cms.form.createdAt"), value: this.$trd(bidData.createdAt)},
          {label: this.$tr("isite.cms.form.updatedAt"), value: this.$trd(bidData.updatedAt)}
        ]
      }

      //Get form data
      let formId = bidData.auction && bidData.auction.category && bidData.auction.category.bidFormId ?
          bidData.auction.category.bidFormId : false

      //Merge values
      if (formId) {
        this.modal.loading = true
        //Get field values
        let requestValues = {}
        bidData.fields.forEach(item => requestValues[item.name] = item.value)
        //get files
        let files = this.$clone(bidData.files || [])
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
