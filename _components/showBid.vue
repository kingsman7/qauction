<template>
  <master-modal v-model="modal.show" :loading="modal.loading" :title="modal.title" custom-position>
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
            <q-item-label v-else caption v-html="item.value"/>
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
      modal: {
        loading: false,
        show: false,
        title: null,
        data: []
      }
    }
  },
  computed: {},
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
            value: parseInt(bidData.winner) ? this.$tr('isite.cms.label.yes') : this.$tr('isite.cms.label.no'),
          },
          {label: this.$tr('isite.cms.label.description'), value: bidData.description},
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
            let fieldValue = requestValues[this.$helper.convertStringToSnakeCase(field.name)]//get field value

            //Get field file
            let fieldFile = (fieldType != 'media') ? null :
                files.find(item => item.zone == (field.dynamicField.props.zone || 'mainimage'))

            //Add extra data to field
            this.modal.data.push({
              ...field,
              label: field.label.replace('*', ''),
              value: (fieldType != 'media') ? (fieldValue == null ? '-' : fieldValue) : [{
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
