<template>

    <form-wizard ref="formwizard" @onComplete="onComplete" @onNextStep="nextStep" @onPreviousStep="previousStep"
        @onReset="reset" >
        <tab-content title="مقدم الطلب" :selected="true" >
            <div class="form-group">
                <label class="form-label mt-2" for="RequesterName">اسم مقدم الطلب:</label>
                <input type="text" class="form-control mt-1 mb-4" :class="hasError('RequesterName') ? 'is-invalid' : ''"
                   placeholder="" v-model="formData.RequesterName">
                <div v-if="hasError('RequesterName')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.RequesterName.required">اسم مقدم الطلب مطلوب</div>
                </div>
            </div>
        </tab-content>
        <tab-content title="عن المنظمة">
            <h1 class="text-white mb-5">نسعد بخدمتك {{ formData.RequesterName }} !</h1>
            <div class="form-group">
                <label class="form-label mt-3" for="companyName">فضلًا تزويدنا باسم المنظمة:</label>
                <input type="text" class="form-control mt-1 mb-4" :class="hasError('companyName') ? 'is-invalid' : ''"
                    placeholder="" v-model="formData.companyName">
                <div v-if="hasError('companyName')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.companyName.required">.
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label mt-3" for="companyID">رقم تسجيل المنظمة أو السجل التجاري:</label>
                <input type="text" class="form-control mt-1 mb-4" :class="hasError('companyID') ? 'is-invalid' : ''"
                    placeholder="" v-model="formData.companyID">
                <div v-if="hasError('companyID')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.companyID.required">رقم التسجيل أو السجل التجاري مطلوب</div>
                    <div class="error" v-if="!$v.formData.companyID.numeric">المدخل يجب ان يكون رقم</div>
                </div>
            </div>
        </tab-content>
        <tab-content title="عن المفوض">
            <div class="form-group">
                <label class="form-label mt-3" for="authName">اسم المفوض لدى {{ formData.companyName }}:</label>
                <input type="text" class="form-control mt-1 mb-4" :class="hasError('authName') ? 'is-invalid' : ''"
                    placeholder="" v-model="formData.authName">
                <div v-if="hasError('authName')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.authName.required">اسم المفوض مطلوب</div>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label mt-3" for="authMobile">رقم الجوال:</label>
                <input type="text" class="form-control mt-1 mb-4" :class="hasError('authMobile') ? 'is-invalid' : ''"
                    placeholder="" v-model="formData.authMobile">
                <div v-if="hasError('authMobile')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.authMobile.required">رقم الجوال مطلوب</div>
                    <div class="error" v-if="!$v.formData.authMobile.numeric">المدخل يجب ان يكون رقم</div>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label mt-3" for="authEmail">البريد الإلكتروني</label>
                <input type="email" class="form-control mt-1 mb-4" :class="hasError('authEmail') ? 'is-invalid' : ''"
                    placeholder="" v-model="formData.authEmail">
                <div v-if="hasError('authEmail')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.authEmail.required">البريد الإلكتروني مطلوب</div>
                    <div class="error" v-if="!$v.formData.authEmail.email">البريد الإلكتروني غير صحيح</div>
                </div>
            </div>
        </tab-content>
        <tab-content title="البيانات البنكية">
            <div class="form-group">
                <label class="form-label mt-3" for="referral">اسم البنك</label>
                <select :class="hasError('referral') ? 'is-invalid' : ''" class="form-control mt-2 mb-4"
                    v-model="formData.referral">
                    <option>البنك الأهلي التجاري</option>
                    <option>بنك الرياض</option>
                    <option>بنك البلاد</option>
                    <option>مصرف الراجحي</option>
                    <option>بنك الجزيرة</option>
                    <option>البنك السعودي للاستثمار</option>
                    <option>سامبا المالية</option>
                    <option>البنك السعودي البريطاني</option>
                    <option>البنك السعودي الهولندي</option>
                    <option>البنك السعودي الفرنسي</option>
                    <option>البنك العربي الوطني</option>
                    <option>مصرف الإنماء</option>
                </select>
                <div v-if="hasError('referral')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.referral.required">Please select on of the fields.</div>
                </div>
            </div>
            <div class="form-group form-check">
                <input type="checkbox" :class="hasError('terms') ? 'is-invalid' : ''" class="form-check-input mt-2 mb-4"
                    v-model="formData.terms">
                <label class="form-check-label mt-3">I accpet terms & conditions</label>
                <div v-if="hasError('terms')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.terms.required">Please select terms and conditions.</div>
                </div>
            </div>
        </tab-content>
    </form-wizard>
</template>

<script>
import FormWizard from '../components/FormWizard.vue';
import TabContent from '../components/TabContent.vue';
import ValidationHelper from '../components/ValidationHelper.vue';
import { required } from 'vuelidate/lib/validators';
import { email } from 'vuelidate/lib/validators';
import { numeric } from 'vuelidate/lib/validators';
const checked = (value) => value === true;

export default {
    name: 'Steps',
    components: {
        FormWizard, TabContent
    },
    mixins: [ValidationHelper],
    data() {
        return {
            formData: {
                RequesterName: '',
                authEmail: null,
                companyName: null,
                companyID: null,
                authName: null,
                authMobile: null,
                referral: null,
                terms: false,
            },
            validationRules: [
                { RequesterName: { required }, },
                { companyName: { required }, companyID: { required, numeric } },
                { authName: { required }, authMobile: { required, numeric }, authEmail: { required, email } },
                { referral: { required }, terms: { checked } }
            ]
        }
    },
    methods: {
        onComplete() {
            alert("Submitting Form ! Rock On");
            this.$refs.formwizard.changeStatus();
        },

        reset() {
            for (let field in this.formData) {
                this.formData[field] = null;
            }
        },

        nextStep() {
            // alert("On Next Step");
        },

        previousStep() {
            //alert("On Previous Step");
        }
    }
}
</script>