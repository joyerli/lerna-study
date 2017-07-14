<style lang="scss" rel="stylesheet/scss">
    .{{name}} {

    }
</style>
<template>
    <cd-page cont-class="{{pageName}}"
             title="请输入标题"
             icon="menu"
             :breadcrumb="true"
             info="请输入提示">
        <cd-panel title="请输入标题">
        </cd-panel>
    </cd-page>
</template>
<script>
    import {CdPage,CdPanel} from 'comp@';

    export default {
        name: '{{name.upperFirst}}',
        components:{
            CdPage,CdPanel,Alert
        },
        data(){
            return {};
        },
        methods:{

        },
        mounted () {
        },
        created(){

        }
    }
</script>
