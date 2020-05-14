function deepClone(obj, parent = null){ 
  let result; // 最后的返回结果

  let _parent = parent; // 防止循环引用
  while(_parent){
    if(_parent.originalParent === obj){
      return _parent.currentParent;
    }
    _parent = _parent.parent;
  }
  
  if(obj && typeof obj === "object"){ // 返回引用数据类型(null已被判断条件排除))
    if(obj instanceof RegExp){ // RegExp类型
      result = new RegExp(obj.source, obj.flags)
    }else if(obj instanceof Date){ // Date类型
      result = new Date(obj.getTime());
    }else{
      if(obj instanceof Array){ // Array类型
        result = []
      }else{ // Object类型，继承原型链
        let proto = Object.getPrototypeOf(obj);
        result = Object.create(proto);
      }
      for(let key in obj){ // Array类型 与 Object类型 的深拷贝
        if(obj.hasOwnProperty(key)){
          if(obj[key] && typeof obj[key] === "object"){
            result[key] = deepClone(obj[key],{ 
              originalParent: obj,
              currentParent: result,
              parent: parent
            });
          }else{
            result[key] = obj[key];
          }
        }
      }
    }
  }else{ // 返回基本数据类型与Function类型,因为Function不需要深拷贝
    return obj
  }
  return result;
}


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



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//encode

var table = [
    "", "0", "1", "2", "3", "4", "5", "6", 
    "7", "8", "9", "a", "b", "c", "d", "e", 
    "f", "g", "h", "i", "j", "k", "l", "m", 
    "n", "o", "p", "q", "r", "s", "t", "u", 
    "v", "w", "x", "y", "z", "A", "B", "C", 
    "D", "E", "F", "G", "H", "I", "J", "K", 
    "L", "M", "N", "O", "P", "Q", "R", "S", 
    "T", "U", "V", "W", "X", "Y", "Z", "=",
    ";", "/", "#", "%", "&", "\'", "\"", "~",
    "~", "<", ">", "@", "_", "`", "\\$", "\\*",
    "\\+", "\\.", "\\?", "\\", "\\^", "\\|", "\\(", "\\)",
    "\\[", "\\]", "\\{", "\\}", "\\\\,", "$", "*", "+",
    ".", "?", "\\", "^", "|", "\\(", "\\[", "\\{",
    "\\)", "\\]", "\\}", "\\,", "\\-", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "[", "(", "{", "[", "(", "{"
    ]//非打印字符可以进行替换
    
    function getIndex(char_char){
        for(getIndex_control = 0;getIndex_control < 128;getIndex_control++){
            if(table[getIndex_control] == char_char){
                return getIndex_control
            }
        }
        return -1
    }
    
    
    
    function typeSub(index){//判断子串字符类型_____()/[]/{}
        if(index == 123 || index == 126){
            return 0//小括号类型
        }else if(index == 122 || index == 125){
            return 1//中括号类型
        }else if(index == 124 || index == 127){
            return 2//大括号类型
        }else{
            return 3//普通字符
        }
    }
    
    function typeChar(index){//判断字符类型
        if(index >= 1 && index <= 10){
            return 0 //数字
        }else if(index >= 11 && index <= 36){
            return 1//小写英文字符
        }else if(index >= 37 && index <= 62){
            return 2//大写英文字符
        }else{
            return 3
        }
    }

    function Char(arg){
        
        if(typeof(arg) == "number"){//使用索引初始化
            this.char_index = arg
            this.char_bin = encode_bin(this.char_index)
            this.char_char = table[this.char_index]
            this.sub_type = typeSub(this.char_index)
            this.char_type = typeChar(this.char_index)
        }
        if(typeof(arg) == "object"){//使用7位数组初始化
            this.char_bin = arg
            this.char_index = decode_bin(this.char_bin)
            this.char_char = table[this.char_index]
            this.sub_type = typeSub(this.char_index)
            this.char_type = typeChar(this.char_index)
        }
        if(typeof arg == "string"){//使用字符初始化
            this.char_index = getIndex(arg)
            this.char_bin = encode_bin(this.char_index)
            this.char_char = arg
            this.sub_type = typeSub(this.char_index)
            this.char_type = typeChar(this.char_index)
        }
        
    
        this.mutation = function(percent){//根据percent百分比概率决定每一位是否进行变异
            for(char_mutation_control = 0;char_mutation_control < 6;char_mutation_control++){
                if(bool_prop(percent)){
                    this.char_bin[char_mutation_control] = NOT(this.char_bin[char_mutation_control])
                    
                }
            }
            this.sync()
            return this.char_type
        }
    
        this.sync = function(){//使char的内部数据同步，总是以二进制串为准
            this.char_index = decode_bin(this.char_bin)
            this.char_char = table[this.char_index]
            this.sub_type = typeSub(this.char_index)
            this.char_type = typeChar(this.char_index)
    
        }
    }

    function SubBlock(MAX_SUB_BLOCK_LENGTH = 3){
        //仅面向小括号子串
        this.sub_chars = []
        this.sub_block_length = MAX_SUB_BLOCK_LENGTH
        this.sub_block_string = ""//该子块对应的字符串
        for(var sub_chars_control = 0;sub_chars_control < MAX_SUB_BLOCK_LENGTH;sub_chars_control++){
            this.sub_chars.push(new Char(1))
            this.sub_block_string = this.sub_block_string + this.sub_chars[sub_chars_control].char_char
        }
    
        this.compile = function(){
            this.sub_block_string = ""
            for(var sub_block_compile_control = 0;sub_block_compile_control < this.sub_block_length;sub_block_compile_control++){
                this.sub_block_string = this.sub_block_string + this.sub_chars[sub_block_compile_control].char_char
            }
        }
        this.mutation = function(sub_out_percent,sub_in_percent = out_percent){//out_percent用于控制单块是否变异   in_percent用于控制块内变异
            
            for(var sub_block_mutation_control = 0;sub_block_mutation_control < this.sub_block_length;sub_block_mutation_control++){
                if(bool_prop(sub_out_percent)){
                    this.sub_chars[sub_block_mutation_control].mutation(sub_in_percent)
                    while(this.sub_chars[sub_block_mutation_control].char_index >= 122){
                        this.sub_chars[sub_block_mutation_control].mutation(sub_in_percent)
                    }
                }
                
            }
            this.compile()
        }
    }
    
    
    function SubString(main_string_index,sub_type,MAX_SUB_BLOCK_SIZE = 3,MAX_SUB_BLOCK_LENGTH = 3){
        this.index = main_string_index//主串中索引
        this.sub_type = sub_type
        this.sub_block_size = MAX_SUB_BLOCK_SIZE//子块数
        this.sub_block_length = MAX_SUB_BLOCK_LENGTH//子块长度
        this.compiled_string = ""//编译后子串
        //以上不参与变异
        if(this.sub_type == 0){//小括号
            this.sub_blocks = []
            
            for(init_second = 0;init_second < MAX_SUB_BLOCK_SIZE;init_second++){
                this.sub_blocks.push(new SubBlock(MAX_SUB_BLOCK_LENGTH))  
            }
            
            this.is_sub_blocks_activated = []
            for(init_third = 0;init_third < MAX_SUB_BLOCK_SIZE;init_third++){
                this.is_sub_blocks_activated.push(1)//初始状态所有子块都处于激活状态
            }
            this.compiled_string = "("
            for(x = 0;x < this.sub_block_size;x++){
                if(this.is_sub_blocks_activated[x] == 1){
                    this.compiled_string = this.compiled_string + this.sub_blocks[x].sub_block_string
                    if(x != MAX_SUB_BLOCK_SIZE - 1){
                        this.compiled_string = this.compiled_string + "|"
                    }
                }
            }
            this.compiled_string = this.compiled_string + ")"
    
    
            
        }else if(sub_type == 1){//中括号
            this.start_index = new Char("0")
            this.end_index = new Char("9")//初始情况为数字区
            this.sub_block_type = typeChar(this.start_index)
            this.isNot = 0//是否使用^取反
            if(this.isNot == 0){
                this.compiled_string = "[" + this.start_index.char_char + "-" + this.end_index.char_char + "]"
            }else{
                this.compiled_string = "[^" + this.start_index.char_char + "-" + this.end_index.char_char + "]"
            }
            
    
    
    
        }else if(sub_type == 2){//大括号
            this.start_index = 0
            this.end_index = 9//范围限定为0-9
            this.isSep = 1//是否使用\，进行限定，当,为false时end_index也应为空(-1)
            this.isSecNull = 0//第二位是否为空
            this.compiled_string = "{" + this.start_index
            if(this.isSep == 1){
                this.compiled_string = this.compiled_string + ","
                if(this.isSecNull == 1){
                    this.compiled_string  = this.compiled_string + this.end_index + "}"
                }else{
                    this.compiled_string = this.compiled_string + "}"
                }
            }else{
                this.compiled_string = this.compiled_string + "}"
            }
        }
    
    
    
        
    
    
        this.compile = function(){
            if(this.sub_type == 0){
                this.compiled_string = "("
                for(x = 0;x < this.sub_block_size;x++){
                    if(this.is_sub_blocks_activated[x] == 1){
                        this.compiled_string = this.compiled_string + this.sub_blocks[x].sub_block_string
                        
                    }
                    if((x != this.sub_block_size - 1) && this.is_sub_blocks_activated[x + 1] == 1 && (this.is_sub_blocks_activated[x] == 1)){
                        this.compiled_string = this.compiled_string + "|"
                    }
                }
                this.compiled_string = this.compiled_string + ")"
    
            }else if(this.sub_type == 1){
    
                if(this.isNot == 0){
                    this.compiled_string = "[" + this.start_index.char_char + "-" + this.end_index.char_char + "]"
                }else{
                    this.compiled_string = "[^" + this.start_index.char_char + "-" + this.end_index.char_char + "]"
                }
    
            }else if(this.sub_type == 2){
                this.compiled_string = "{" + this.start_index
                if(this.isSep == 1){
                    this.compiled_string = this.compiled_string + ","
                    if(this.isSecNull == 0){
                        this.compiled_string  = this.compiled_string + this.end_index + "}"
                    }else{
                        this.compiled_string = this.compiled_string + "}"
                    }
                }else{
                    this.compiled_string = this.compiled_string + "}"
                }
            }
        }
    
    
    
    
        this.mutation = function(out_percent,in_percent = out_percent,sub_out_percent = out_percent,sub_in_percent = in_percent){
            
            if(bool_prop(out_percent)){
                if(this.sub_type == 0){//小括号
                    
                    for(x = 0;x < this.sub_block_size;x++){//进行控制数组变异
                        if(bool_prop(in_percent)){
                            this.is_sub_blocks_activated[x] = NOT(this.is_sub_blocks_activated[x])
                        }
                    }
                    
                    for(x = 0;x < this.sub_block_size;x++){
                        //if(util.bool_prop(in_percent)){
                            this.sub_blocks[x].mutation(sub_out_percent,sub_in_percent)
                            
                            
                        //}
                    }
                this.compile()
    
    
    
    
    
    
    
                }else if(this.sub_type == 1){//中括号
                    
                    if(bool_prop(in_percent)){
                        this.isNot = NOT(this.isNot)
                    }
                    //if(util.bool_prop(in_percent)){
                        
                        this.start_index.mutation(in_percent)
                        
                        while(this.start_index.char_index > 62 || x == 0){
                            this.start_index.mutation(in_percent)
                        }
                        
                        
                        if(typeChar(this.start_index.char_index) == 0){//start_index变异后在数字区时
                            
                            this.end_index = new Char(interval_prop(this.start_index.char_index + 1 , 10))
                            
                        }
                        
                        if(typeChar(this.start_index.char_index) == 1){
                            
                            this.end_index = new Char(interval_prop(this.start_index.char_index + 1 , 36))
                            
                        }
                        if(typeChar(this.start_index.char_index) == 2){
                            
                            this.end_index = new Char(interval_prop(this.start_index.char_index + 1 , 62))
                            
                        }
                    
                        
                        
                    //}
                    this.compile()
    
                }else if(this.sub_type == 2){//大括号
                    if(bool_prop(in_percent)){
                        this.isSep = NOT(this.isSep)
                    }
                    if(bool_prop(in_percent)){
                        this.isSecNull = NOT(this.isSecNull)
                    }
                    if(bool_prop(in_percent)){
                        this.start_index = interval_prop(0,8)
                        this.end_index = interval_prop(this.start_index,9)
                    }
                }
            }
        }
    
    }
    




//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



function Group(group_number,MAX_REGEX_LENGTH = 10){
    this.group_number = group_number
    this.regex_group = []
    this.length = MAX_REGEX_LENGTH
    this.mutation_pool = []
    this.crossover_pool = []
    this.origin_pool = []
    this.breed_pool = []
    this.selection_pool = []


    for(var regex_group_generate_control = 0;regex_group_generate_control < group_number;regex_group_generate_control++){
        this.regex_group.push(new Regex(MAX_REGEX_LENGTH))
    }


    this.load_origin_pool = function(op_source,is_refresh = true){
        if(is_refresh){
            this.origin_pool = []
        }
        for(var lop_ctrl = 0;lop_ctrl < op_source.length;lop_ctrl++){
            this.origin_pool.push(deepClone(op_source[lop_ctrl]))
        }
    }

    this.load_crossover_pool = function(cp_source,is_refresh = true){
        if(is_refresh){
            this.crossover_pool = []
        }
        for(var lcp_ctrl = 0;lcp_ctrl < cp_source.length;lcp_ctrl++){
            this.crossover_pool.push(deepClone(cp_source[lcp_ctrl]))
        }
    }

    this.load_mutation_pool = function(mp_source,is_refresh = true){
        if(is_refresh){
            this.mutation_pool = []
        }
        for(var lmp_ctrl = 0;lmp_ctrl < mp_source.length;lmp_ctrl++){
            this.mutation_pool.push(deepClone(mp_source[lmp_ctrl]))
        }
    }
    
    this.load_breed_pool = function(bp_source,is_refresh = true){
        if(is_refresh){
            this.breed_pool = []
        }
        for(var lbp_ctrl = 0;lbp_ctrl < bp_source.length;lbp_ctrl++){
            
            this.breed_pool.push(deepClone(bp_source[lbp_ctrl]))
        }
        
    }

    this.load_seletion_pool = function(sp_source,is_refresh = true){
        if(is_refresh){
            this.selection_pool = []
        }
        for(var lsp_ctrl = 0;lsp_ctrl < sp_source.length;lsp_ctrl++){
            var midmid = deepClone(sp_source[lsp_ctrl])
            
            this.selection_pool.push(midmid)
            
        }
    }



    this.group_mutation = function(out_percent,in_percent = out_percent,sub_out_percent = out_percent,sub_in_percent = in_percent){
        
        for(var gm_ctrl = 0;gm_ctrl < this.mutation_pool.length;gm_ctrl++){
            
            this.mutation_pool[gm_ctrl].mutation(out_percent,in_percent,sub_out_percent,sub_in_percent)
            
        }
    }

    this.crossover = function(times,percent){//times:总尝试交叉次数，percent:单次交叉概率
        
        for(var co_counter = 0;co_counter < times;co_counter ++){
            if(bool_prop(percent)){
                var a = 0
                var b = 0
                while(a == b){
                    a = interval_prop(0,this.crossover_pool.length - 1)
                    b = interval_prop(0,this.crossover_pool.length - 1)
                }
                //取得不同ab值作为pool中索引
                try{
                    this.crossover_single(this.crossover_pool[a],this.crossover_pool[b])
                }catch(e){

                }
                
                
            }

            
        }

    }

    this.crossover_single = function(co_obj_a,co_obj_b){//单次单点交叉,参数为参与交叉的两个regex对象
        var co_index = interval_prop(0,this.length)//生成变异位点
        var mid_main_str_char = co_obj_a.char_array[co_index]
        var mid_sub_str_char = co_obj_a.sub_string[co_index]
        co_obj_a.char_array[co_index] = co_obj_b.char_array[co_index]
        co_obj_a.sub_string[co_index] = co_obj_b.sub_string[co_index]
        co_obj_b.char_array[co_index] = mid_main_str_char
        co_obj_b.sub_string[co_index] = mid_sub_str_char
        co_obj_a.compile()
        co_obj_b.compile()
        co_obj_a.sync_exp()
        co_obj_b.sync_exp()
        
        

    }


    this.calc_capa_val = function(_wl,_bl){//对种群中每个个体计算适应值
        for(var rg = 0;rg < this.group_number;rg++){
            this.regex_group[rg].capability(_wl,_bl)
        }
    }
    //log-------------------------------
    this.log = function(){
        console.log("GROUP-----------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.regex_group.length;log_ctrl++){
            
            console.log(this.regex_group[log_ctrl].capability_value + "  " + this.regex_group[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")
    }

    this.log_pool = function(){
        console.log("ORIGIN----------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.origin_pool.length;log_ctrl++){
            console.log(this.origin_pool[log_ctrl].capability_value + "  " + this.origin_pool[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")

        console.log("BREED-----------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.breed_pool.length;log_ctrl++){
            console.log(this.breed_pool[log_ctrl].capability_value + "  " + this.breed_pool[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")
        
        console.log("CROSSOVER-------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.crossover_pool.length;log_ctrl++){
            console.log(this.crossover_pool[log_ctrl].capability_value + "  " + this.crossover_pool[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")

        console.log("MUTATION--------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.mutation_pool.length;log_ctrl++){
            console.log(this.mutation_pool[log_ctrl].capability_value + "  " + this.mutation_pool[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")

        console.log("SELECTION-------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.selection_pool.length;log_ctrl++){
            console.log(this.selection_pool[log_ctrl].capability_value + "  " + this.selection_pool[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")
    }
    

    this.log_slc_pool = function(){
        console.log("SELECTION-------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.selection_pool.length;log_ctrl++){
            console.log(this.selection_pool[log_ctrl].capability_value + "  " + this.selection_pool[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")
    }

    this.log_mut_pool = function(){
        console.log("MUTATION--------------------------------")
        for(var log_ctrl = 0;log_ctrl < this.mutation_pool.length;log_ctrl++){
            console.log(this.mutation_pool[log_ctrl].capability_value + "  " + this.mutation_pool[log_ctrl].regex_string)
        }
        console.log("----------------------------------------")
    }
    //capa------------------------------
    this.slc_calc_capa = function(_wl,_bl){
        for(var slc_capa = 0;slc_capa < this.selection_pool.length;slc_capa++){
            this.selection_pool[slc_capa].compile()
            this.selection_pool[slc_capa].sync_exp()
            this.selection_pool[slc_capa].capability(_wl,_bl)
            //console.log(this.selection_pool[slc_capa].capability_value)
        }
    }

    this.brd_calc_capa = function(_wl,_bl){
        for(var brd_capa = 0;brd_capa < this.group_number;brd_capa++){
            this.breed_pool[brd_capa].capability(_wl,_bl)
        }
    }

    this.ori_calc_capa = function(_wl,_bl){
        for(var ori_capa = 0;ori_capa < this.group_number;ori_capa++){
            this.origin_pool[ori_capa].capability(_wl,_bl)
        }
    }
    
    this.mut_calc_capa = function(_wl,_bl){
        for(var mut_capa = 0;mut_capa < this.group_number;mut_capa++){
            this.mutation_pool[mut_capa].capability(_wl,_bl)
        }
    }

    this.cro_calc_capa = function(_wl,_bl){
        for(var cro_capa = 0;cro_capa < this.group_number;cro_capa++){
            this.crossover_pool[cro_capa].capability(_wl,_bl)
        }
    }
    //------------------

    this.slc_group_sync = function(){//out
        for(var gs_ctrl = 0;gs_ctrl < this.selection_pool.length;gs_ctrl++){
            //this.selection_pool[gs_ctrl].
        }
    }

    this.selection = function(){
        
        var imm = this.selection_pool.length
        var jpp
        var tempExchangVal
        while (imm > 0) {
            for (jpp = 0; jpp < imm - 1; jpp++) {
                if (this.selection_pool[jpp].capability_value > this.selection_pool[jpp + 1].capability_value){
                    tempExchangVal = this.selection_pool[jpp]
                    this.selection_pool[jpp] = this.selection_pool[jpp + 1]
                    this.selection_pool[jpp + 1] = tempExchangVal
                }
            }
            imm--
        }
        var mind = this.group_number
        var slc_ctrl = this.selection_pool.length
        this.regex_group = []
        
        while(mind > 0){
            slc_ctrl--
            this.regex_group.push(deepClone(this.selection_pool[slc_ctrl]))
            mind--
        }
        
        


    }

    this.breed = function(){
        
        var total_capability_value = 0
        for(var bp_ctrl = 0;bp_ctrl < this.breed_pool.length;bp_ctrl++){
            total_capability_value += this.breed_pool[bp_ctrl].capability_value
        }
        
        var breed_mid = 0
        var bm_result = []
        for(var bm_ctrl = 0;bm_ctrl < this.breed_pool.length;bm_ctrl++){
            breed_mid = Math.round(this.breed_pool[bm_ctrl].capability_value / total_capability_value * this.group_number)
            breed_mid++
            while(breed_mid > 0){
                bm_result.push(deepClone(this.breed_pool[bm_ctrl]))
                breed_mid--
            }
            
        }
        this.breed_pool = bm_result
    }
}


function sort(array){//用于根据适应值排序
    var i = array.length, j;
    var tempExchangVal;
    while (i > 0) {
        for (j = 0; j < i - 1; j++) {
            if (array[j] > array[j + 1]) {
                tempExchangVal = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tempExchangVal;
            }
        }
        i--;
    }
    
    mlog(array)
}



function Regex(length){
    //对应字符串
    //对应表达式
    //对应二进制形式
    //长度
    //
    this.regex_string = ""
    this.capability_value = 0
    this.char_array = []//主串集合
    this.sub_string = []//子串集合
    this.regex_length = length
    

    for(var regex_generate_control = 0;regex_generate_control < length;regex_generate_control++){//初始化
        this.char_array.push(new Char(1))
        this.sub_string.push(0)//初始化子串
        this.regex_string = this.regex_string + this.char_array[regex_generate_control].char_char
    }
    
    this.reg_exp = new RegExp(this.regex_string)
    


    this.capability = function(_white_list,_black_list){//根据黑白名单计算适应值
        this.capability_value = 0
        for(wl_ctrl = 0;wl_ctrl < _white_list.length;wl_ctrl++){
            if(this.match(_white_list[wl_ctrl])){
                this.capability_value++
            }
            
        }
        for(bl_ctrl = 0;bl_ctrl < _black_list.length;bl_ctrl++){
            if(!this.match(_black_list[bl_ctrl])){
                this.capability_value++
            }
        }
        return this.capability_value
    }

    this.getSubStringByIndex = function(sub_string_index){//根据索引获取子串的字符表示
        
        return this.sub_string[sub_string_index].compiled_string
    }

    this.mutation = function(out_percent,in_percent = out_percent,sub_out_percent = out_percent,sub_in_percent = in_percent){
        var flag = false
        while(!flag){
            
            if(this.char_array.length > this.regex_length){
                
                this.char_array.pop()
                this.sub_string.pop()
            }
            try{
                flag = true
                for(reg_mut_ctrl = 0;reg_mut_ctrl < this.char_array.length;reg_mut_ctrl++){
                    //令主串中每一char进行变异
                    if(bool_prop(out_percent)){
                        this.char_array[reg_mut_ctrl].mutation(in_percent)
                        if(typeSub(this.char_array[reg_mut_ctrl].char_index) != 3){//变异出子串字符后向子串中添加对应类型子串
                            this.sub_string[reg_mut_ctrl] = new SubString(reg_mut_ctrl,typeSub(this.char_array[reg_mut_ctrl].char_index))
                        }else{
                            this.sub_string[reg_mut_ctrl] = 0//否则置零
                        }
                    }
                    for(sub_mut_ctrl = 0;sub_mut_ctrl < this.sub_string.length;sub_mut_ctrl++){//令子串变异
                        if(this.sub_string[sub_mut_ctrl] != 0){
                            this.sub_string[sub_mut_ctrl].mutation(out_percent,in_percent,sub_out_percent,sub_in_percent)
                        }
                    }
                    
                }
                this.compile()
                this.sync_exp()
            }catch(e){
                flag = false
                
            }
        }
        
        this.compile()
        this.sync_exp()
        
        
        
        //处理表达式不合法的情况
        
    }

    this.compile = function(){
        var result = ""
        for(var reg_cmp_ctrl = 0;reg_cmp_ctrl < this.regex_length;reg_cmp_ctrl++){
            
            if(this.char_array[reg_cmp_ctrl].char_char == "{"){
                result = result + this.getSubStringByIndex(reg_cmp_ctrl)
            }else if(this.char_array[reg_cmp_ctrl].char_char == "("){
                result = result + this.getSubStringByIndex(reg_cmp_ctrl)
            }else if(this.char_array[reg_cmp_ctrl].char_char == "["){
                result = result + this.getSubStringByIndex(reg_cmp_ctrl)
            }else{
                result = result + this.char_array[reg_cmp_ctrl].char_char
            }
        }
        this.regex_string = result
        
    }

    // this.clone = function(){
    //     let result = new Regex(this.regex_length)
    //     result.regex_string = this.regex_string
    //     result.capability_value = this.capability_value
    //     result.char_array = this.char_array
    //     result.sub_string = this.sub_string
    //     result.reg_exp = this.reg_exp
    //     result.clone = this.clone
    //     try{
    //         result.compile()
    //         result.sync_exp()
    //     }catch(e){

    //     }
        
    //     return result

    // }
    this.array_mode = function(){
        var result = ""
        for(var am_ctrl = 0;am_ctrl < this.char_array.length;am_ctrl++){
            result = result + this.char_array[am_ctrl].char_char
        }
        console.log(result)
    }



    this.sync_exp = function(){//将正则表达式字符串生成对应正则表达式
        this.reg_exp = new RegExp(this.regex_string)
    }

    this.match = function(str){//检测是否完全匹配
        
        var mid = str.match(this.reg_exp)
        if(mid == null){
            return false
        }
        var result = false
        for(mt_control = 0;mt_control < mid.length;mt_control++){
            
            if(mid[mt_control] == str){
                result = true
            }
        }
        return result
    }
}



function run(whitelist,blacklist,outmutprob,inmutprob,outsubmutprob,insubmutprob,groupnumber,regexlength,generation,capabilitylimitation,crossoverprob,crossovertimes){
    var environment = new Group(groupnumber,regexlength)
    var flag = true
    
    while(flag){
        try{
            flag = false
            while(environment.regex_group[0].capability_value < capabilitylimitation && generation > 0){
                
                environment.calc_capa_val(whitelist,blacklist)
                environment.load_origin_pool(environment.regex_group)
            
            
                environment.load_breed_pool(environment.regex_group)
                environment.breed()
                
            
                environment.load_crossover_pool(environment.breed_pool)
                environment.crossover(crossovertimes,crossoverprob)
                
            
                environment.load_mutation_pool(environment.crossover_pool)
                environment.group_mutation(outmutprob,inmutprob,outsubmutprob,insubmutprob)
                environment.mut_calc_capa(whitelist,blacklist)
                
                
                environment.load_seletion_pool(environment.mutation_pool)
                environment.load_seletion_pool(environment.crossover_pool,false)
                environment.load_seletion_pool(environment.origin_pool,false)
                environment.slc_calc_capa(whitelist,blacklist)
                
                
                environment.selection()
                
                environment.log()
                console.log(generation)
                generation--
            }

        }catch(e){
            flag = true
        }
    }
    
    
    var result = []
    for(var result_gen_ctrl = 0;result_gen_ctrl < environment.regex_group.length;result_gen_ctrl++){
        result.push({
            rank:result.length + 1,
            capability_value:environment.regex_group[result_gen_ctrl].capability_value,
            regex_string:environment.regex_group[result_gen_ctrl].regex_string
        })
    }
    return result


}

function sample(){
    var wl = ["0","011","114514","9",]
    var bl = ["a","b","c"]
    mlog(run(wl,bl,40,60,90,50,3,3,20000,7,50,50))
}
