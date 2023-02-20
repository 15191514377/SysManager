export default {
    deleteSameItem: (list) => {
        if (list === []) {
            return []
        }
        const temp = [list[0]]
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < temp.length; j++) {
                if (list[i].id !== temp[j].id) {
                    if (temp.every(item => item.id !== list[i].id)) {
                        temp.push(list[i])
                    }
                }
            }
        }
        return temp
    },
    addItem: (oldArr, newArr) => {
        if (oldArr === [] && newArr === []) {
            const temp = []
            newArr.forEach(item1 => {
                oldArr.forEach(item2 => {
                    if (item1.id === item2.id) {
                        temp.push(item1)
                    }
                })
            });
            return temp
        } else {
            return [...oldArr, ...newArr].filter(item => item)
        }

    },
    /**
     * 根据属性删除数组1与数组2的公共元素
     * @param {*} arr1 :源数组1
     * @param {*} arr2 :源数组2
     * @param {*} obj :删除要依据的属性,未指定值时，则根据对象删除
     * @returns 
     */
    getDifferent: (arr1, arr2, prop) => {
        if(!arr1.length) return JSON.parse(JSON.stringify(arr2))
        if(!arr2.length) return JSON.parse(JSON.stringify(arr1))
        arr1.forEach(e1 => {
            arr2.forEach(e2 => {
                if (e1[prop]&&e2[prop]) {
                    if (JSON.stringify(e1[prop]) === JSON.stringify(e2[prop])) {
                        e1.delete = true
                        e2.delete = true
                    }
                } else {
                    if (JSON.stringify(e1) === JSON.stringify(e2)){
                        e1.delete = true
                        e2.delete = true
                    } 
                }
            })
        })

        const result =  [...arr1,...arr2].filter(item => !item?.delete)

        return JSON.parse(JSON.stringify(result.length?result:[]))
    },

    /**
     * 删除数组中的指定元素
     * @param {*} arr :源数组
     * @param {*} item :要删除的元素
     * @param {*} obj ：根据obj属性删除
     * @returns 
     */
    deleteItem: (arr, item, obj) => {
        arr.forEach(e=>{
            if(obj){
                if(e[obj] === item[obj]) e.delete = true
            }else{
                if(JSON.stringify(e)===JSON.stringify(item)) e.e.delete = true
            }
        })


        return JSON.parse(JSON.stringify(arr.filter(e=>!e.delete)))
    },

    deleteSameItemFromOtherArray(arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].id === arr2[j].id) {
                    arr1[i].delete = true
                }
            }
        }
        return arr1.filter(item =>!item.delete)
    },
    
    /**
     * 根据某一属性，打平数组
     * @param {*} arr1 :源数组
     * @param {*} prop :依据的属性
     */
    flatArray(arr1,prop){
        const result = []
        const arr = JSON.parse(JSON.stringify(arr1))
        for(let i = 0; i<arr.length; i++){
            if(result.every(item=>item.id !== arr[i].id)){
                result.push(arr[i])
            }
            if(arr[i][prop]){
                for(let j = 0; j<arr[i][prop].length;j++){
                    if(result.every(item=>item.id !== arr[i][prop][j].id)){
                        result.push(arr[i][prop][j])
                    }
                }
            }
            delete arr[i][prop]
        }
        return result
    }
}