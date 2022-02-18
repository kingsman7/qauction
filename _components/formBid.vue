<template>
  <master-modal id="fromBidComponent" v-model="show" custom-position v-bind="modalProps"
                :loading="loading" @hide="clear">
    <dynamic-form v-if="show" v-model="form" :blocks="formBlocks" :form-id="extraFormId"
                  @submit="createBid"/>
  </master-modal>
</template>
<script>
export default {
  props: {},
  components: {},
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
      extraFormId: null
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
            amount: {
              value: '',
              type: 'input',
              columns: 'col-12',
              props: {
                type: 'number',
                label: `${this.$tr('isite.cms.label.amount')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
            },
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
