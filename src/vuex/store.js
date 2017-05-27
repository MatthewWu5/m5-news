import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        c1Data: {
            para1: 11,
            para2: 12
        },
        c2Data: {
            para1: 21,
            para2: 22
        },
        Data4: 'data4 in state',
        TestData: 'testGetter string',
    },
    mutations: {
        Update(state, payload) {
            var param = payload.params;
            if (param.c1Data) {
                state.c1Data.para1 = param.c1Data.para1;
                state.c1Data.para2 = param.c1Data.para2;
            }
            if (param.c2Data) {
                state.c2Data.para1 = param.c2Data.para1;
                state.c2Data.para2 = param.c2Data.para2;
            }
            console.log('mutations state: ' + state);
        }
    },
    actions: {
        UpdateByAction({ commit, state }, params) {
            console.log('state: ' + state);
            commit('Update', params);
            console.log('updated state: ' + state);
        }
    },
    // getters: {
    //     GetData1: state => {
    //         return state.c1Data;
    //     },
    //     GetData3: state => {
    //         return state.c1Data;
    //     },
    //     GetData2: state => {
    //         return state.c2Data;
    //     }
    // }
    getters
})