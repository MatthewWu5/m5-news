# m5-news

> vuejs, vonic ui, nodejs

## Practice problems

- when does the child component init its prop

got an error `Cannot convert undefined or null to object`, because `_labelMaps` isnot init
```
<button-bar theme="positive" :tab-items="Object.keys(_labelMaps)"
 data() {
    return {
         _labelMaps: {Mancity: '曼城', Barca: '巴塞罗那', Barclays: '英超', All: ''}
    }
 }
```



## To implement

- [x] package a axios, 
1. remove the `requestStatus` => write a loading in the axios, `interceptors`  
https://segmentfault.com/q/1010000009350401/a-1020000009351474

2. add console.error in catch

- [ ] how to effect a component in popup, write it in the vonic $popup

- [ ] how to make es7 `Object.values()` compatible with ios safari(works on laptop), babel-preset-env and babel-loader in config are not effect, use `Object.keys()` instead
