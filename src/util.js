//util
function encode_bin(integer){//将0~127的整数转换为二进制数组
    var mid = []
    
    while(integer >= 1){
        mid.push(Math.floor(integer % 2))
        integer = integer / 2
    }
    var result = []
    while(mid.length < 7){
        mid.push(0)

    }
    for(x = 6;x >= 0;x--){
        result.push(mid[x]) 
    }
    return result
}

function decode_bin(bin_array){
    return 64 * bin_array[0] +
            32 * bin_array[1] +
            16 * bin_array[2] +
            8 * bin_array[3] +
            4 * bin_array[4] +
            2 * bin_array[5] +
            bin_array[6]
}

function bool_prop(percent){//根据百分数值返回是否发生的boolean
    var a = Math.floor(Math.random() * 100) + 1
    if (a <= percent){
        return true
    }else{
        return false
    }
}
function NOT(int_bool){//对整数01取反
    if(int_bool == 0) return 1
    else return 0
}

function interval_prop(l,r){//根据所给区间生成随机数
    return Math.floor(Math.random() * (r - l + 1)) + l
}
function mlog(obj){
    console.log(JSON.stringify(obj))
}

module.exports = {
    encode_bin,
    decode_bin,
    bool_prop,
    NOT,
    interval_prop,
    mlog,
}
