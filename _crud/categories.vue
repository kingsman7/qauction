<template></template>
<script>
//Component
import crud from "@imagina/qcrud/_components/crud";

export default {
  data() {
    return {
      crudId: this.$uid(),
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qauctions.entityNames.category"),
        apiRoute: "apiRoutes.qauction.categories",
        permission: "iauctions.categories",
        extraFormFields: "iauctions.crud-fields.categories",
        create: {
          title: this.$tr("iauctions.cms.newCategory"),
        },
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "name",
              label: this.$tr("isite.cms.form.title"),
              field: "title",
              align: "rigth",
            },
            {
              name: "systemName",
              label: this.$tr("isite.cms.form.systemName"),
              field: "systemName",
              align: "left",
            },
            {
              name: "auctionForm",
              label: this.$tr("iauctions.cms.auctionForm"),
              field: "auctionForm",
              align: "left",
              format: val => val ? val.title : '-'
            },
            {
              name: "bidForm",
              label: this.$tr("iauctions.cms.bidForm"),
              field: "bidForm",
              align: "left",
              format: val => val ? val.title : '-'
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
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
        },
        update: {
          title: this.$tr("iauctions.cms.updateCategory"),
          requestParams: {},
        },
        delete: true,
        formLeft: {
          id: {value: ""},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: "",
            type: "input",
            isTranslatable: true,
            props: {
              label: `${this.$tr("isite.cms.form.title")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          auctionFormId: {
            type: "crud",
            props: {
              crudType: "select",
              crudData: import("@imagina/qform/_crud/crudForms"),
              crudProps: {
                label: this.$tr("iauctions.cms.auctionForm"),
              },
              config: {
                options: {
                  label: "title",
                  value: "id",
                },
              },
            },
          },
          bidFormId: {
            type: "crud",
            props: {
              crudType: "select",
              crudData: import("@imagina/qform/_crud/crudForms"),
              crudProps: {
                label: this.$tr("iauctions.cms.bidForm"),
              },
              config: {
                options: {
                  label: "title",
                  value: "id",
                },
              },
            },
          },
          bidService: {
            value: "",
            type: "input",
            isTranslatable: true,
            props: {
              label: `${this.$tr("isite.cms.label.service")}`
            },
          },
        },
        getDataForm: (formData, type) => {
          return new Promise(resolve => {
            if (type == 'create') {
              //Add system name
              formData.systemName = this.$helper.getSlug(formData[this.$store.state.qsiteApp.defaultLocale].title)
            }
            //Resolve
            resolve(formData)
          })
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },
  },
};
</script>
