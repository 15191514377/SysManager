<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="less">

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
}
/* table公共样式 */
// table {
//   width: 90%;
//   height: 90%;
//   border-radius: 5px;
//   border-collapse: collapse;

//   td {
//     border: 1px solid rgba(157, 152, 152, 0.5);
//     font-size: 18px;
//     text-align: center;
//     vertical-align: middle;
//   }

//   thead {
//     font-size: 18px;
//     font-weight: 600;
//     text-align: center;
//     vertical-align: middle;
//     background-color: aqua;
//     color: gray;

//     tr {
//       height: 5vh;
//     }
//   }

//   tfoot {
//     tr {
//       td {
//         padding-top: 3vh;
//         height: 5vh;
//         text-align: left;
//         border: none;
//       }
//     }
//   }
// }
// input公共样式
// input{
//   outline: none;
//   border: 1px solid rgb(174, 166, 166);
//   border-radius: 3px;
// }

// button公共样式
// button{
//   height: 25px;
//   padding: 3px 5px;
//   font-size: 12px;
//   cursor: pointer;
// }

// span{
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   overflow: hidden;
// }

//解决图片缩放时失真
img{
  image-rendering:crisp-edges;
}

// .footer {
//   display: flex;
//   justify-content: space-between;
// }

</style>
