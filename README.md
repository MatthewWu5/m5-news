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

- [ ] write a loading in the axios, `interceptors`
https://segmentfault.com/q/1010000009350401/a-1020000009351474

- [ ] how to effect a component in popup, write it in the vonic $popup
