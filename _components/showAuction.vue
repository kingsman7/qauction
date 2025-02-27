<template>
  <!--Show Auction-->
  <master-modal id="showAuctionModal" v-model="modal.show" :loading="modal.loading"
                :title="modal.title" custom-position>
    <!--Tabs panel-->
    <q-tabs v-model="modal.tab" dense class="box box-auto-height text-grey q-mb-md"
            active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
      <q-tab name="form" :label="$tr('isite.cms.label.information')"/>
      <q-tab name="bids" :label="$trp('iauctions.cms.bid')" v-if="appMode == 'iadmin'"/>
      <q-tab name="chart" :label="$trp('isite.cms.label.chart')" v-if="isShow"/>
    </q-tabs>

    <!--Tabs panel-->
    <q-tab-panels v-model="modal.tab" animated keep-alive>
      <!--form Tab-->
      <q-tab-panel name="form" class="box box-auto-height q-pa-none">
        <q-list separator dense>
          <q-item v-for="(item, itemKey) in formData" :key="itemKey" style="padding: 8px 0">
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
      <q-tab-panel name="bids" class="q-pa-none" v-if="appMode == 'iadmin'">
        <!--Show Bid Data-->
        <show-bid-data ref="showBidData"/>
        <!--list-->
        <q-table id="tableBids" v-bind="bidsTableProps">
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <btn-menu :actions="bidActions(props)" :action-data="props.row"/>
            </q-td>
          </template>
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <q-icon v-if="props.rowIndex == 0" color="green" name="fas fa-crown" class="q-mr-xs">
                <q-tooltip>
                  {{ $tr('isite.cms.label.recommendation') }}
                </q-tooltip>
              </q-icon>
              {{ props.value }}
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <!--chart Tab-->
      <q-tab-panel name="chart" class="q-pa-none" v-if="isShow">
        <!--chart-->
        <q-charts :chartsData="chartData"/>
      </q-tab-panel>
    </q-tab-panels>
  </master-modal>
</template>
<script>
//Component
import showBidData from '@imagina/qauction/_components/showBid'
import QCharts from '@imagina/qsite/_components/master/charts.vue'

export default {
  name: "ShowAuction",
  components: {showBidData, QCharts},
  data() {
    return {
      appMode: config('app.mode'),
      auctionData: null,
      formData: [],
      bids: [],
      modal: {
        loading: false,
        show: false,
        title: null,
        tab: 'form'
      },
    }
  },
  computed: {
    // show tab chart
    isShow() {
      return this.appMode == 'iadmin' && this.bids.length
    },
    //Payout Table
    bidsTableProps() {
      return {
        hidePagination: true,
        columns: [
          {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
          {
            name: 'provider', label: this.$tr('isite.cms.label.provider'), field: 'provider', align: 'left',
            format: val => val ? `${val.firstName} ${val.lastName}` : '-',
          },
          {name: 'statusName', label: this.$tr('isite.cms.form.status'), field: 'statusName', align: 'left'},
          {
            name: 'amount', label: this.$tr('isite.cms.label.amount'), field: 'amount', align: 'left',
            format: val => val ? this.$trn(val) : '-',
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
        data: this.bids
      }
    },
    //set chart's labels
    dataLabels() {
      if (!this.bids.length) return [];
      const label = [{name: '0', label: '0', data: 0}]
      const lineData = this.$clone(this.bids)
      lineData.map((item) => {
        label.push({
          name: `${item.provider.firstName} ${item.provider.lastName}`,
          label: `${item.provider.firstName} ${item.provider.lastName}, ${this.$trn(item.amount)}, ${this.$trn(item.points)}`,
          data: item.points
        })
      })
      return label
    },
    //set dataset
    dataSets() {
      if (!this.dataLabels.length) return [];
      return [{
        label: this.$tr('iauctions.cms.bid'),
        borderColor: "#3597f9",
        pointBackgroundColor: '#FFFFFF',
        borderWidth: 1,
        pointBorderColor: "#c7c7c7",
        backgroundColor: '#3597f97a',
        data: this.dataLabels.map(({data}) => data)
      }]
    },
    //send format Data chart
    chartData() {
      if (!this.dataSets.length) return {};
      return {
        type: 'lineChart',
        dataSets: this.dataSets,
        dataLabels: this.dataLabels
      }
    },
  },
  methods: {
    //create random color
    randomColor() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`
    },
    //Fields to show
    async showAuctionData(itemData) {
      this.auctionData = itemData
      //Set modal data
      this.modal = {
        title: `${this.$tr('iauctions.cms.auction')} Id: ${itemData.id}`,
        show: true,
        loading: true,
        tab: 'form',
      }

      //Get data
      await Promise.all([
        this.getFormData(),
        this.getBids()
      ])

      //Hide loading
      this.modal.loading = false
    },
    //Get extra form fields
    getFormData() {
      return new Promise(resolve => {
        let itemData = this.$clone(this.auctionData)

        this.formData = [
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

        //Get form data
        let formId = itemData.category && itemData.category.auctionFormId ?
            itemData.category.auctionFormId : false

        //Merge values
        if (!formId) return resolve(true)

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
            let fieldValue = requestValues[this.$helper.convertStringToSnakeCase(field.name)]//get field value
            //Get field file
            let fieldFile = (fieldType != 'media') ? null :
                files.find(item => item.zone == (field.dynamicField.props.zone || 'mainimage'))

            //Add extra data to field
            this.formData.push({
              ...field,
              label: field.label.replace('*', ''),
              value: (fieldType != 'media') ? (fieldValue != null ? fieldValue : '-') : [{
                id: this.$uid(),
                ...fieldFile,
                filename: field.label,
              }],
              fieldType: fieldType
            })
          })

          resolve(true)
        }).catch(error => {
          resolve(true)
        })
      })
    },
    //Get bids
    getBids() {
      return new Promise(resolve => {
        //request params
        let requestParams = {
          refresh: true,
          params: {
            filter: {auctionId: this.auctionData?.id},
            include: 'provider,fields,auction.category'
          }
        }
        //Request
        this.$crud.index('apiRoutes.qauction.bids', requestParams).then(response => {
          this.bids = response.data
          resolve(true)
        }).catch(error => {
          resolve(true)
        })
      })
    },
    //Bid Actions
    bidActions(field) {
      let actions = [
        {
          name: 'show',
          icon: 'far fa-eye',
          label: this.$tr('isite.cms.label.show'),
          action: (item) => {
            this.$refs.showBidData.showBidData(item)
          }
        },
        {
          name: 'mark as winner',
          icon: 'fas fa-trophy',
          label: this.$tr('iauctions.cms.setAsWinner'),
          format: item => {
            if (item.auction.status == 2 && item.auction.type == 1 && !item.winner)
              return {}
            else return {vIf: false}
          },
          action: (item) => {
            this.setBidAsWinner(item)
          }
        }
      ]

      //response
      return actions
    },
    //Set bid as winner
    setBidAsWinner(bid) {
      this.$alert.warning({
        mode: 'modal',
        title: this.$trp('iauctions.cms.setAsWinner'),
        message: `
          <div>${this.$tr('isite.cms.label.provider')}: ${bid.provider.firstName} ${bid.provider.lastName}</div>
          <div>${this.$tr('isite.cms.label.amount')}: ${this.$trn(bid.amount)}</div>`,
        actions: [
          {label: this.$tr('isite.cms.label.cancel'), color: 'grey-8'},
          {
            label: this.$tr('isite.cms.label.send'),
            color: 'red',
            handler: () => {
              this.modal.loading = true
              //request Params
              let requestData = {winner: 1}
              //request
              this.$crud.update('apiRoutes.qauction.bids', bid.id, requestData).then(response => {
                this.$alert.info({message: `${this.$tr('isite.cms.message.recordCreated')}`})
                //Emit event to refrsh crud
                this.$root.$emit('crud.data.refresh')
                this.modal.loading = false
                this.modal.show = false
              }).catch(error => {
                this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoCreated')}`})
                this.modal.loading = false
              })
            }
          },
        ]
      })
    }
  }
}
</script>
<style lang="stylus">
#showAuctionModal
  .q-tab-panels
    background transparent

  #tableBids
    th
      color $blue-grey
      font-weight bold
      font-size 13px !important

    td
      color #222222

</style>
