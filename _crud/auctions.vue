<template></template>
<script>
//Component
import crud from '@imagina/qcrud/_components/crud'

export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qauction.entityNames.auction"),
        apiRoute: 'apiRoutes.qauction.auctions',
        permission: 'iauctions.auctions',
        extraFormFields: 'iauctions.crud-fields.auctions',
        create: {
          title: this.$tr('iauction.cms.label.newAuction'),
        },
        update: {
          title: this.$tr('iauction.cms.label.newAuction'),
          requestParams: {include: 'parent'}
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left'},
            {name: 'typeName', label: this.$tr('isite.cms.form.type'), field: 'typeName', align: 'left'},
            {
              name: 'startAt', label: this.$tr('isite.cms.form.startDate'), field: 'startAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'endAt', label: this.$tr('isite.cms.form.endDate'), field: 'endAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'statusName', label: this.$tr('isite.cms.form.status'), field: 'statusName', align: 'left'},
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          filters: {
            statusName: {
              value: null,
              type : 'treeSelect',
              props: { label: this.$tr('isite.cms.form.status') },
              loadOptions: {
                apiRoute: 'apiRoutes.qauction.auctions',
                requestParams: {filter: {statusName: 1}}
              }
            },
          }
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
            type: 'input',
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
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
        },
        formRight: {
          status: {
            value: '1',
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.status')}*`,
              options: [
                {label: this.$tr('isite.cms.label.inactive'), value: '0'},
                {label: this.$tr('isite.cms.label.active'), value: '1'},
                {label: this.$tr('isite.cms.label.finished'), value: '2'},
              ],
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          type: {
            value: '1',
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.status')}*`,
              options: [
                {label: this.$tr('isite.cms.label.open'), value: '1'},
                {label: this.$tr('isite.cms.label.inverse'), value: '0'}
              ],
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          startAt: {
            value: '',
            type: 'date',
            props: {
              label: this.$tr('isite.cms.form.startDate'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          endAt: {
            value: '',
            type: 'date',
            props: {
              label: this.$tr('isite.cms.form.endDate'),
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
                label: `${this.$trp('iforms.common.types.departmen')}*`,
                rules: [
                  val => (!!val && val.length) || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
            }
          },
          categoryId: {
            value: 1,
           /*  type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/quser/_crud/departments'),
              crudProps: {
                label: `${this.$trp('iprofile.cms.label.userGroup')}*`,
                rules: [
                  val => (!!val && val.length) || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
            } */
          },
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
