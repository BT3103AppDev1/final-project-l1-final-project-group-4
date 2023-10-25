import { createApp } from "vue";
// import vuetify from "./plugins/vuetify.js";
// import VDatePicker from "@/plugins/vuetify.js";
import App from "./App.vue";
import router from "./router/index.js";
import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";
// import Vue from "vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import InputNumber from "primevue/inputnumber";
import TextArea from "primevue/textarea";
import DynamicDialog from "primevue/dynamicdialog";
import DialogService from "primevue/dialogservice";
import Toolbar from "primevue/toolbar";
import RadioButton from "primevue/radiobutton";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import FocusTrap from "primevue/focustrap";
import Password from "primevue/password";
import Divider from "primevue/divider";
// createApp(App).use(router).use(VueChartkick).mount("#app");

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.use(DialogService);
app.directive("focustrap", FocusTrap);

app.component("Password", Password);
app.component("Divider", Divider);
app.component("RadioButton", RadioButton);
app.component("Dialog", Dialog);
app.component("Textarea", Textarea);
app.component("Toolbar", Toolbar);
app.component("DynamicDialog", DynamicDialog);
app.component("TextArea", TextArea);
app.component("InputNumber", InputNumber);
app.component("Tag", Tag);
app.component("Dropdown", Dropdown);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Calendar", Calendar);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("Toast", Toast);

app.use(router);
app.use(VueChartkick);
app.mount("#app");
