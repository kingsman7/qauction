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
        apiRoute: "apiRoutes.qauctions.categories",
        permission: "iauctions.categories",
        extraFormFields: "iauctions.crud-fields.categories",
        create: {
          title: this.$tr("qauctions.layout.newCategory"),
        },
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("ui.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "name",
              label: this.$tr("ui.form.title"),
              field: "title",
              align: "rigth",
            },
            {
              name: "slug",
              label: this.$tr("ui.form.slug"),
              field: "slug",
              align: "left",
            },
            {
              name: "status",
              label: this.$tr("ui.form.status"),
              field: "status",
              align: "left",
            },
            {
              name: "parent",
              label: this.$tr("ui.form.parent"),
              field: "parent",
              align: "left",
              format: (val) => (val ? (val.title ? val.title : "-") : "-"),
            },
            {
              name: "created_at",
              label: this.$tr("ui.form.createdAt"),
              field: "createdAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            {
              name: "actions",
              label: this.$tr("ui.form.actions"),
              align: "left",
            },
          ],
          requestParams: { include: "parent" },
          filters: {
            parentId: {
              value: null,
              type: "treeSelect",
              props: {
                label: this.$tr("ui.form.parent"),
              },
              loadOptions: {
                apiRoute: "apiRoutes.qauction.categories",
                requestParams: { filter: { status: 1 } },
              },
            },
          },
        },
        update: {
          title: this.$tr("qauctions.layout.updateCategory"),
          requestParams: { include: "parent" },
        },
        delete: true,
        formLeft: {
          id: { value: "" },
          userId: { value: this.$store.state.quserAuth.userId },
          title: {
            value: "",
            type: "input",
            isTranslatable: true,
            props: {
              label: `${this.$tr("ui.form.title")}*`,
              rules: [(val) => !!val || this.$tr("ui.message.fieldRequired")],
            },
          },
          systemName: {
            value: "",
            type: "input",
            isTranslatable: false,
            props: {
              label: `${this.$tr("ui.form.systemName")}*`,
              rules: [(val) => !!val || this.$tr("ui.message.fieldRequired")],
            },
          },
          description: {
            value: "",
            type: "html",
            isTranslatable: true,
            props: {
              label: `${this.$tr("ui.form.description")}*`,
              rules: [(val) => !!val || this.$tr("ui.message.fieldRequired")],
            },
          },
          metaTitle: {
            value: "",
            isTranslatable: true,
            type: "input",
            props: {
              label: this.$tr("ui.form.metaTitle"),
            },
          },
          metaDescription: {
            value: "",
            type: "input",
            isTranslatable: true,
            props: {
              label: this.$tr("ui.form.metaDescription"),
              type: "textarea",
              rows: 3,
            },
          },
        },
        formRight: {
          auctionFormId: {
            type: "crud",
            props: {
              crudType: "select",
              crudData: import("@imagina/qform/_crud/crudForms"),
              crudProps: {
                label: `${this.$tr("ui.label.form")}`,
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
                label: `${this.$tr("ui.label.form")}`,
              },
              config: {
                options: {
                  label: "title",
                  value: "id",
                },
              },
            },
          },
          status: {
            value: "1",
            type: "select",
            isTranslatable: false,
            props: {
              label: `${this.$tr("ui.form.status")}*`,
              options: [
                { label: this.$tr("ui.label.enabled"), value: "1" },
                { label: this.$tr("ui.label.disabled"), value: "0" },
              ],
              rules: [(val) => !!val || this.$tr("ui.message.fieldRequired")],
            },
          },
          masterRecord: {
            value: 0,
            isFakeField: true,
            type: "select",
            props: {
              label: this.$tr("ui.form.masterRecord"),
              options: [
                { label: this.$tr("ui.label.yes"), value: 1 },
                { label: this.$tr("ui.label.no"), value: 0 },
              ],
            },
          },
          parentId: {
            value: 0,
            type: "treeSelect",
            props: {
              label: this.$tr("ui.form.parent"),
              options: [{ label: this.$tr("ui.label.disabled"), value: 0 }],
            },
            loadOptions: {
              apiRoute: "apiRoutes.qauction.categories",
              select: { label: "title", id: "id" },
              requestParams: { include: "parent", filter: { status: 1 } },
            },
          },
          showMenu: {
            value: false,
            type: "checkbox",
            props: {
              label: this.$tr("qauctions.layout.form.showInMenu"),
            },
          },
          featured: {
            value: "0",
            type: "checkbox",
            props: {
              label: this.$tr("qauctions.layout.form.featured"),
              trueValue: "1",
              falseValue: "0",
            },
          },
          internal: {
            value: "0",
            type: "checkbox",
            props: {
              label: this.$tr("ui.label.internal"),
              trueValue: "1",
              falseValue: "0",
            },
          },
          sortOrder: {
            value: "0",
            type: "input",
            props: {
              label: this.$tr("qauctions.layout.form.sortOrder"),
              type: "number",
            },
          },
          mediasSingle: {
            name: "mediasSingle",
            value: {},
            type: "media",
            props: {
              label: this.$tr("ui.form.firstImage"),
              zone: "mainimage",
              entity: "Modules\\Iauctions\\Entities\\Category",
              entityId: null,
            },
          },
          mediasSingle2: {
            name: "mediasSingle",
            value: {},
            type: "media",
            props: {
              label: this.$tr("ui.form.secondaryImage"),
              zone: "secondaryimage",
              entity: "Modules\\Iauctions\\Entities\\Category",
              entityId: null,
            },
          },
        },
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },
  },
};
</script>
