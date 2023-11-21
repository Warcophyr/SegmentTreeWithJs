function sum(array, start, end)
{
    if(start === undefined)
    {
        start = 0;
    }
    if(end === undefined)
    {
        end = array.length-1;
    }
    if(start === end)
    {
        return array[start];
    }
    let result = 0
    for (let index = start; index < end+1; index++)
    {
        const element = array[index];
        result += element;
    }
    return result;
}

class SegmentNode
{
    constructor(array, range, sonLeft, sonRight)
    {
        this.value = sum(array, range[0], range[1]);
        this.range = range;
        this.sonLeft = sonLeft
        this.sonRight = sonRight

        if(range[0] < range[1])
        {
            this.sonLeft = new SegmentNode(array, [range[0], Math.floor((range[0]+range[1])/2)], undefined, undefined)
            this.sonRight =new SegmentNode(array, [Math.floor((range[0]+range[1])/2)+1, range[1]], undefined, undefined)
        }
    }

    visit(depth) {
        let space = '';
        for (let i = 0; i < depth; i++)
            space += ' ';
        console.log(space + this.value + " " + this.range);
        if (this.sonLeft)
            this.sonLeft.visit(depth + 1);

        if (this.sonRight)
            this.sonRight.visit(depth + 1);
    }
   
}


class  SegmentTree
{
    constructor(array)
    {
        this.root = new SegmentNode(array, [0,array.length-1], undefined, undefined);
        this.array =  array
    }

    foundSum(tree, start, end)
    {
        let result = 0;
        if(start < 0 || start > this.array.length)
        {
            console.error("index start out of range");
        }
        else if(end < 0 || end > this.array.length)
        {
            console.error("index end out of range");
        }
        else
        {
            if(tree !== undefined)
            {
                if(tree.range[0] === tree.range[1])
                {
                    result += tree.value;
                }
                else if((start >= tree.range[0]) && (end <= tree.range[1]))
                {
                    if(start > tree.sonLeft.range[1])
                    {
                        result += this.foundSum(tree.sonRight, start, end);
                    }
                    else if(end < tree.sonRight.range[0])
                    {
                        result += this.foundSum(tree.sonLeft, start, end);
                    }
                    else
                    {
                        result += this.foundSum(tree.sonLeft, start, end);
                        result += this.foundSum(tree.sonRight, start, end);
                    }
                    
                }
                else if((start == tree.range[0]) && (end > tree.range[1]) || ((start < tree.range[0]) && (end == tree.range[1])))
                {
                    result += tree.value;
                }
                else if(start > tree.range[0] && end > tree.range[1])
                {   
                    result += this.foundSum(tree.sonRight, start, end);
                    if(start < tree.range[1])
                    {
                        result += this.foundSum(tree.sonLeft, start, end);
                    }
                }
                else if(start <= tree.range[0] && end <= tree.range[1])
                {
                    result += this.foundSum(tree.sonLeft, start, end);
                    if(end >= tree.range[1])
                    {
                        result += this.foundSum(tree.sonRight, start, end);
                    }
                }
                return result;
            }
            
        }   
    }

    getSum(start, end)
    {
        if(start === this.root.range[0] && end === this.root.range[1])
        {
            return this.root.value;
        }
        let result = this.foundSum(this.root, start, end);
        return result;

    }

    foundAndReplace(tree, index, oldValue, newValue)
    {
        if (tree !== undefined)
        {
            let leftBound = tree.range[0];
            let rightBound = tree.range[1];
        
            if(index >= leftBound && index <= rightBound && oldValue !== newValue )
            {
                tree.value = tree.value-oldValue+newValue
                this.foundAndReplace(tree.sonLeft, index, oldValue, newValue);
                this.foundAndReplace(tree.sonRight, index, oldValue, newValue);
            }
        }
        
    }

    update(index, newValue)
    {
        if(index > 0 && index < this.array.length)
        {
            this.foundAndReplace(this.root, index, this.array[index], newValue);
            this.array[index] = newValue;
            
        }
        else
        {
            console.error("index out of range");
        }   
    }
    visit() 
    {
        this.root.visit(0);
        console.log("======================")
    } 
}


let array = [1, 3, 5, 7, 9, 11]
let seg = new SegmentTree(array)
// seg.visit()
// // seg.update(3, 8);
// // seg.visit()
// console.log(seg.getSum(0,5) + " sum");

function allSubAarray(a)
{
    let b = [];
    for (let i = 0; i < a.length; i++) 
    {
        for (let j = i+1; j <= a.length; j++) 
        {
            b.push(sum(a.slice(i,j)));
        }
    }
    return b
}

let arrayTest = allSubAarray(array);
console.log(arrayTest)

function test(tree, array)
{
    
    let value = undefined;
    for (let i = 0; i < tree.array.length; i++) {
        for (let j = i; j <  tree.array.length; j++) {
            value = tree.getSum(i,j);
            let found = 0;
            for (let k = 0; k < array.length; k++) {
                if(value === array[k])
                {
                    found = 1;
                }
            }
            if(found === 1)
            {
                console.log(true, value);   
            }
            else
            {
                console.log(false, value);   
            }
        } 
        
    }
}

test(seg, arrayTest);