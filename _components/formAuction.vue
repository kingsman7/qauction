<template>
  <master-modal id="fromAuctionComponent" v-model="show" custom-position v-bind="modalProps"
                :loading="loading" @hide="clear">
    <dynamic-form v-if="show" v-model="form" :blocks="formBlocks" @submit="createAuction"/>
  </master-modal>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {
    async watchCategoryId(newValue, oldValue) {
      //Call extra form
      if (newValue && (newValue != this.selectedCategoryId)) {
        this.selectedCategoryId = this.$clone(newValue)
        await this.getExtraForm()
      }
      //set roleId selected.
      if (!newValue && this.selectedCategoryId)
        this.form['categoryId'] = this.$clone(this.selectedCategoryId)
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      show: false,
      loading: false,
      categories: [],
      extraBlocks: [],
      form: {},
      selectedCategoryId: null,
      modalProps: {},
    }
  },
  computed: {
    formBlocks() {
      let response = [
        {
          name: 'category',
          title: this.$tr('isite.cms.form.category'),
          fields: {
            categoryId: {
              value: null,
              type: 'optionGroup',
              colClass: 'col-12',
              props: {
                options: this.categories.map(item => {
                  return {label: item.title, value: item.id}
                }),
                color: 'secondary',
                rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')]
              }
            }
          }
        },

        {
          name: 'block1',
          fields: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            title: {
              value: '',
              type: 'input',
              columns: 'col-12',
              isTranslatable: true,
              props: {
                label: `${this.$tr('isite.cms.form.title')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
            },
            description: {
              value: '',
              type: 'html',
              columns: 'col-12',
              isTranslatable: true,
              props: {
                label: `${this.$tr('isite.cms.form.description')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
          }
        },
        {
          name: 'block2',
          fields: {
            type: {
              value: '0',
              type: 'select',
              clearable: true,
              props: {
                label: this.$tr('isite.cms.form.type') + '*',
                options: [
                  {label: this.$tr('isite.cms.label.inverse'), value: '0'},
                  {label: this.$tr('isite.cms.label.open'), value: '1'}
                ],
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ]
              }
            },
            departmentId: {
              value: null,
              type: 'crud',
              props: {
                crudType: 'select',
                crudData: import('@imagina/quser/_crud/departments'),
                crudProps: {
                  label: `${this.$trp('iprofile.cms.label.userGroup')}*`,
                  rules: [
                    val => (!!val && val.length) || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
              }
            },
            startAt: {
              value: null,
              type: 'fullDate',
              props: {
                label: this.$tr('isite.cms.form.startDate') + '*',
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ]
              }
            },
            endAt: {
              value: null,
              type: 'fullDate',
              props: {
                label: this.$tr('isite.cms.form.endDate') + '*',
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ]
              }
            }
          }
        },
        ...this.$clone(this.extraBlocks)
      ]

      //Response
      return response
    },
    //To watch category Id
    watchCategoryId() {
      return this.form['categoryId']
    }
  },
  methods: {
    init() {
      this.getCategories()
    },
    //Get selected category
    getCategories() {
      return new Promise((resolve, reject) => {
        //Open loading
        this.loading = true
        this.categories = []

        //Request Params
        let requestParams = {refresh: true}

        //Request
        this.$crud.index('apiRoutes.qauction.categories', requestParams).then(response => {
          this.categories = response.data
          this.loading = false
          resolve(response.data)
        }).catch(error => {
          this.loading = false
          reject(error)
        })
      })
    },
    //Load Form
    loadform(params) {
      this.show = true
      this.modalProps = params.modalProps
    },
    //Get form fields
    getExtraForm() {
      return new Promise((resolve, reject) => {
        //reset extra blocks
        this.extraBlocks = []
        //Get Role selected
        let category = this.categories.find(item => item.id == this.form['categoryId'])

        //validate role
        if (!category || !category.auctionFormId) return reject(false)

        //Open loading
        this.loading = true

        //Request Params
        let requestParams = {
          refresh: true,
          params: {include: 'blocks.fields'}
        }

        //Request
        this.$crud.show('apiRoutes.qform.forms', category.auctionFormId, requestParams).then(response => {
          //Set extra blocks
          let extraBlocks = response.data.blocks.map(block => {
            return {...block, fields: block.fields.map(field => field.dynamicField)}
          })
          //concat block name to fields
          extraBlocks.forEach((block, blockKey) => {
            let fields = {}
            block.fields.forEach((field, fieldKey) => fields[`${field.name}`] = field)
            extraBlocks[blockKey].fields = fields
          })
          //set data
          this.extraBlocks = this.$clone(extraBlocks)
          resolve(response.data)
          this.loading = false
        }).catch(error => {
          reject(error)
          this.loading = false
        })
      })
    },
    //Get formData
    getFormData() {
      let form = this.$clone(this.form)
      let currentDate = new Date()

      //Instance respons
      let response = {}

      //order form data
      this.formBlocks.forEach(block => {
        Object.keys(form).forEach(fieldKey => {
          //Get field name, removed block name from fieldKey
          let fieldName = fieldKey.replace(`${block.name}-`, '')

          //Set value
          if (Object.keys(block.fields).includes(fieldKey)) {
            response[fieldName] = form[fieldKey]
          }
        })
      })

      //Response
      return response
    },
    //Create Auction
    createAuction() {
      return new Promise(resolve => {
        this.loading = true
        //get formData
        let formData = this.$clone(this.form)
        //Request
        this.$crud.create('apiRoutes.qauction.auctions', formData).then(response => {
          //Notification
          this.$alert.info({message: `${this.$tr('isite.cms.message.recordCreated')}`})
          //Reset data
          this.clear()
          //Emit event to refrsh crud
          this.$root.$emit('crud.data.refresh')
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
      this.extraBlocks = []
      this.form = {}
      this.selectedCategoryId = null
      this.modalProps = {}
      this.show = false
    }
  }
}
</script>
<style lang="stylus">
#fromAuctionComponent
  #dynamicFormComponent
    .q-option-group
      width 100%

      .q-radio
        width 100%
        border 2px solid $secondary
        border-radius $custom-radius-items
        margin-bottom 10px
        padding 10px

        .q-radio__label
          color $blue-grey
</style>
