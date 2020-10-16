/*
 * @Author: CSU_XZY
 * @Date: 2020-10-15 21:17:45
 * @LastEditors: CSU_XZY
 * @LastEditTime: 2020-10-16 22:25:17
 * @FilePath: \第二天\计算器\compute.js
 * @Description: just to play
 */
var ysf = ['+','÷','=',')','%','x','-','D'];
var sizeyunsuan = ['+','÷','(','x','-'];
var isNumber = ['1','2','3','4','5','6','7','8','9','0','.'];


function showDetails(number)
{
    var number = number.getAttribute("data-value");
    var text = document.getElementById('display').innerText;
//回退一个文字
    if(number === 'D')
    {
        text = text.substring(0,text.length-1);
        document.getElementById('display').innerHTML=text;
        return;
    }
//判断第一个数字是不是运算符
    else if(judgeBegin(number) && text == "")
    return;
//判断是否是连续两个运算符一起输入
    else if(judgeBegin(number) && judgeNext(text,number) && text[text.length-1] !== ')')
    return;
//判断第一个输入是不是‘.’，如果是变为0.
    else if(number === '.' && text == "")
    number = "0.";
//如果输入归0，清空输入
    else if(number === 'C')
    {
        document.getElementById('text').innerHTML="";
        document.getElementById('display').innerHTML="";
        return;
    }
//输入是等号就判断
    else if(number === '=')
    {
        //将数字与运算符分开
        let array = [];
        let n = text.length;
        for(let i = 0; i < n; i++)
        {
            var JudgeNumber = true;
            let res = "";
            //判断第一个数字是否是负号
            if(i===0 && text[i] === '-')
            {
                res+=text[i];
                i++;
            }
            //判断是不是在运算符之后的减号，是就变为负号
            if(i !== 0 && near(array[array.length-1]) && text[i] === '-')
            {
                res+=text[i];
                i++;
            }
            //判断是否为连续的数字
            while(JudgeIsNumber(text[i]) && i < n)
            {
                res += text[i];
                i++;
                JudgeNumber = false;
            }
            //如果不为数字了要回退一个
            if(JudgeNumber === false)
            i--;
            //判断其他运算符
            if(JudgeNumber === true)
            if(judgeBegin(text[i]) || text[i] === '(' ||  text[i] === '-' || text[i] === ')')
            res+=text[i];
            array.push(res);
        }
        //
            console.log(array);
        //中缀表达式变为后缀表达式
        var hz = houZhui(array);
        console.log(hz);
        var result = compute(hz);
        document.getElementById('text').innerHTML = text;
        document.getElementById('display').innerHTML = result;
        return;
    }
    text+=number;
    document.getElementById('display').innerHTML=text;
}

//判断是不是运算符
function judgeBegin(number)
{
    for(let i = 0; i < ysf.length; i++)
    {
        if(ysf[i] === '-')
        continue;
        if(ysf[i] === number)
        return true;
    }
    return false;
}

//判断是否输入两个连续的运算符
function judgeNext(text,number)
{
    if(number === '-')
    return;
    let a = text.length;
    if(judgeBegin(text[a-1]) && judgeBegin(number))
    return true;
    return false;
}

//判断输入的字符里面是不是数字
function JudgeIsNumber(number){
    for(let i = 0; i < isNumber.length; i++)
    {
        if(isNumber[i] === number)
        return true;
    }
    return false;
}

//判断减号前面是否有别的运算符从而确定是不是负号
function near(number)
{
    for(let i = 0; i < sizeyunsuan.length; i++)
    {
        if(sizeyunsuan[i] === number)
        return true;
    }
    return false;
}

//中缀表达式改为后缀表达式
function houZhui(array)
{
    var stack = [];
    var textArea = [];
    for(let i = 0; i < array.length; i++)
    {
        if(near(array[i]) || array[i] === ')')
        {
            //如果是空直接入栈
            if(stack.length === 0)
            stack.push(array[i]);
            //如果栈顶为左括号直接入栈
            else if(stack[stack.length-1] === '(')
            stack.push(array[i]);
            //如果输入左括号直接入栈
            else if(array[i] === '(')
            stack.push(array[i]);
            //如果输入的是右括号
            else if(array[i] === ')')
            {
                //一直弹出直到遇到左括号
                while(stack[stack.length-1] !== '(')
                {
                    let a = stack.pop();
                    textArea.push(a);
                }
                //弹出左括号
                stack.pop();
            }
            else if(array[i] === '-' || array[i] === '+')
            {
                while(stack[stack.length-1] !== '(' && stack.length !== 0)
                {
                    let a = stack.pop();
                    textArea.push(a);
                }
                stack.push(array[i]);
            }
            else if(array[i] === 'x' || array[i] === '÷')
            {
                while(stack[stack.length-1] !== '(' && stack[stack.length-1] !== '+' && stack[stack.length-1] !== '-' && stack.length !== 0)
                {
                    let a = stack.pop();
                    textArea.push(a);
                }
                stack.push(array[i]);
            }
        }
        else{
            textArea.push(array[i])
        }
    }
    while(stack.length !== 0)
    {
        let a = stack.pop();
        textArea.push(a);
    }
    return textArea;
}

//计算后缀表达式
function compute(array){
    var NUMBER = [];
    for(let i = 0; i < array.length; i++)
    {
        //是运算符就计算
        if(near(array[i])){
            //加法
            if(array[i] === '+')
            {
                if(NUMBER.length < 2)
                return "错误";
                else
                {
                    let a = NUMBER.pop();
                    let b = NUMBER.pop();
                    let c = a + b;
                    NUMBER.push(c);
                }
            }
            //减法
            else if(array[i] === '-')
            {
                if(NUMBER.length < 2)
                return "错误";
                else
                {
                    let a = NUMBER.pop();
                    let b = NUMBER.pop();
                    let c = b - a;
                    NUMBER.push(c);
                }
            }
            //乘法
            else if(array[i] === 'x')
            {
                if(NUMBER.length < 2)
                return "错误";
                else
                {
                    let a = NUMBER.pop();
                    let b = NUMBER.pop();
                    let c = a * b;
                    NUMBER.push(c);
                }
            }
            //除法
            else if(array[i] === '÷')
            {
                if(NUMBER.length < 2)
                return "错误";
                else
                {
                    let a = NUMBER.pop();
                    let b = NUMBER.pop();
                    if(a === 0)
                    return "0不能作为除数";
                    let c = b / a;
                    NUMBER.push(c);
                }
            }
        }
        else{
            if(array[i][0] === '-')
            {
                let temp = array[i].substring(1,array[0].length);
                let num = parseFloat(temp);
                num = -num;
                NUMBER.push(num);
            }
            else{
                let num = parseFloat(array[i]);
                NUMBER.push(num);
            }
            console.log(NUMBER);
        }
    }
    if(NUMBER.length !== 1)
    return "错误";
    else
    {
        let b = String(NUMBER[0]);
        return b;
    }
}