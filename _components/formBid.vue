<template>
  <master-modal id="fromBidComponent" v-model="show" custom-position v-bind="modalProps"
                :loading="loading" @hide="clear">
    <!--Show Bid Data-->
    <div v-if="bidData" class="box box-auto-height">
      <div class="text-center">
        <div class="q-mb-lg text-grey-8">{{ $tr('iauctions.cms.existBid') }}</div>
        <q-btn :label="$tr('isite.cms.label.show')" color="green" unelevated rounded
               @click="$refs.showBidData.showBidData(bidData)"/>
      </div>
      <!--bidData-->
      <show-bid-data ref="showBidData"/>
    </div>
    <!--bidUp From-->
    <dynamic-form v-else-if="show" v-model="form" :blocks="formBlocks" :form-id="extraFormId"
                  @submit="createBid"/>
  </master-modal>
</template>
<script>
//Component
import showBidData from '@imagina/qauction/_components/showBid'

export default {
  props: {},
  components: {showBidData},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      show: false,
      loading: false,
      form: {},
      modalProps: {},
      auctionId: null,
      extraFormId: null,
      bidData: null
    }
  },
  computed: {
    formBlocks() {
      let response = [
        {
          name: 'block1',
          fields: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            providerId: {value: this.$store.state.quserAuth.userId},
            auctionId: {value: this.auctionId},
            description: {
              value: '',
              type: 'html',
              columns: 'col-12',
              props: {
                label: `${this.$tr('isite.cms.form.description')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
            amount: {
              value: '',
              type: 'input',
              columns: 'col-12',
              props: {
                type: 'number',
                label: `${this.$tr('isite.cms.label.price')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
            },
          }
        }
      ]

      //Response
      return response
    }
  },
  methods: {
    init() {
    },
    //Load Form
    loadform(params) {
      this.show = true
      this.extraFormId = params.extraFormId
      this.auctionId = params.auctionId
      this.modalProps = params.modalProps
      this.getBid()
    },
    //Get User Bid by auction
    getBid() {
      this.loading = true
      return new Promise(resolve => {
        //request params
        let requestParams = {
          refresh: true,
          params: {
            filter: {
              field: 'auction_id',
              providerId: this.$store.state.quserAuth.userId
            },
            include: 'provider,fields,auction.category'
          }
        }
        //Request
        this.$crud.show('apiRoutes.qauction.bids', this.auctionId, requestParams).then(response => {
          this.bidData = response.data
          this.loading = false
          resolve(true)
        }).catch(error => {
          this.loading = false
          resolve(true)
        })
      })
    },
    //Create Bid
    createBid() {
      return new Promise(resolve => {
        this.loading = true
        //get formData
        let formData = this.$clone(this.form)
        //Request
        this.$crud.create('apiRoutes.qauction.bids', formData).then(response => {
          //Notification
          this.$alert.info({message: `${this.$tr('isite.cms.message.recordCreated')}`})
          //Reset data
          this.clear()
          //Hidden loading
          this.loading = false
        }).catch(error => {
          this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoCreated')}`})
          this.loading = false
        })
      })
    },
    //Clear
    clear() {
      this.form = {}
      this.auctionId = null
      this.extraFormId = null
      this.show = false
    }
  }
}
</script>
<style lang="stylus">
</style>
