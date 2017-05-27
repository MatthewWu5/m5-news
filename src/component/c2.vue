<template>
    <div>
        <h>c2</h>
        <router-link :to="{name: 'HomeView'}">Redirect to Component1</router-link>
        <button @click="OnC1DataChangeClick">OnC1DataChangeClick</button>
        <button @click="OnC2DataChangeClick">OnC2DataChangeClick</button>
        <button @click="OnPostServerDataClick">Get data by post</button>
        <button @click="OnPostServerDataClick2">Get data2 by post</button>
        <button @click="OnGetServerDataClick">Get data2 by get</button>
        <div>{{GetData1}}</div>
        <div>{{GetData2}}</div>
        <div>{{GetData3}}</div>
        <div>{{GetData4}}</div>
        <div>{{TestGetter}}</div>
        <div>{{data4}}</div>
    </div>
</template>

<script>

import store from '../vuex/store'
//!!!Do not use mapper, cause you cannot resolve the babel plugin issue, it cost a lot 
import { mapGetters } from 'vuex'
import axios from 'axios';
import url from '../../server/url'

export default {
    name: 'c2',
    methods: {
        OnPostServerDataClick: () => {
            axios.post(url.getData1, {pData1: 'test1', pData2: 'test2'})
            .then(resp => {
                console.log(resp.data)
            })
            .catch(err => {
                console.log('err');
                console.log(err);
            })
        },
        OnPostServerDataClick2: () => {
            axios.post(url.getData2, {pData1: 'test1', pData2: 'test2'})
            .then(resp => {
                console.log(resp.data)
            })
            .catch(err => {
                console.log('err');
                console.log(err);
            })
        },
        OnGetServerDataClick: () => {
            axios.get(url.getData1)
            .then(resp => {
                console.log(resp.data)
            })
            .catch(err => {
                console.log('err');
                console.log(err);
            })
        },
        OnC2DataChangeClick: () => {
            store.commit({
                type: 'Update',
                params: {
                    c2Data: {
                        para1: 211
                    }
                }
            });
        },
        OnC1DataChangeClick: () => {
            //this.data4 = this.GetData4;
            // console.log(this.data4);
            // console.log(this.GetData4);
            // console.log(this.TestGetter);
            store.dispatch({
                type: 'UpdateByAction',
                params: {
                    c1Data: {
                        para1: 111
                    }
                }
            });
            //By mapActions
            // this.UpdateByAction({
            //     c1Data: {
            //         para1: 111
            //     }
            // });
        },
        // ...mapActions([
        //     'UpdateByAction',
        // ])
        // ...mapAction({
        //     Update: 'UpdateByAction'
        // }),

    },
    computed: {
        GetData1: () => store.getters.GetData1,
        GetData2: () => store.getters.GetData2,
        GetData3: () => store.getters.GetData3,
        GetData4: () => store.getters.GetData4,
        TestGetter: () => store.getters.TestGetter,
        TestComputed: function () {
            //TestComputed is a property, not function, you cannot add parameters here
        },
        //...mapGetters(['GetData1','GetData2','GetData3'])
    },
    data() {
        return {
            data4: 'im data 4',
        }
    }
}
</script>
