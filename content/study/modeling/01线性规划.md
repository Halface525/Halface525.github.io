---
data: 2025-12-12
tags:
  - 数学建模
  - 线性规划
lastdate: 2025-12-21
---
这里在运筹学里面进行过系统学习，这里只是简单总结和拓展。
大部分例题来自[[数学建模算法与应用（第3版）.pdf]]
# 模型
## 不同形式

一般形式
$$\begin{align*} &\max(\text{或 } \min) \ z = \sum_{j=1}^{n} c_j x_j, \\ &\text{s. t.} \begin{cases} \sum_{j=1}^{n} a_{ij} x_j \leq (\text{或}=, \geq) \ b_i, & i = 1,2,\cdots,m, \\ x_j \geq 0, & j = 1,2,\cdots,n. \end{cases} \end{align*}$$
向量形式为
$$\begin{align*} &\max(\text{或 } \min) \ z = \boldsymbol{c}^\mathrm{T} \boldsymbol{x}, \\ &\text{s. t.} \begin{cases} \sum_{j=1}^{n} \boldsymbol{P}_j x_j \leq (\text{或}=, \geq) \ \boldsymbol{b}, \\ \boldsymbol{x} \geq \boldsymbol{0}. \end{cases} \end{align*}$$
矩阵形式为
$$ \begin{align*} &\max(\text{或 } \min) \ z = \boldsymbol{c}^\mathrm{T} \boldsymbol{x}, \\ &\text{s. t.} \begin{cases} \boldsymbol{A}\boldsymbol{x} \leq (\text{或}=, \geq) \ \boldsymbol{b}, \\ \boldsymbol{x} \geq \boldsymbol{0}. \end{cases} \end{align*} $$
标准型
$$ \begin{align*} &\max \ z = \sum_{j=1}^{n} c_j x_j, \\ &\text{s. t.} \begin{cases} \sum_{j=1}^{n} a_{ij} x_j = b_i, & i = 1,2,\cdots,m, \\ x_j \geq 0, & j = 1,2,\cdots,n. \end{cases} \end{align*} $$ 式中：$b_i \geq 0, \ i=1,2,\cdots,m$

## 灵敏度分析

> [!tip] 对于数学规划模型，一定要做灵敏度分析

对于灵敏度，在第三章非线性规划中具体说明。

# 求解

## Matlab求解

如果要用求解器求解首先要化成Matlab的标准型，与运筹学中不同。
$$ \begin{aligned} \min_{x}\ & f^\text{T}x, \\ \text{s.t.}\ & \begin{cases} A \cdot x \leq b, \\ Aeq \cdot x = beq, \\ lb \leq x \leq ub. \end{cases} \end{aligned} $$ 式中：$f, x, b, beq, lb, ub$ 为**列向量**，其中 $f$ 为价值向量，$b$ 为资源向量；$A, Aeq$ 分别为不等式约束和等式约束对应的矩阵。

```matlab 
[x,fval] = linprog(f,A,b) 
[x,fval] = linprog(f,A,b,Aeq,beq) 
[x,fval] = linprog(f,A,b,Aeq,beq,lb,ub)
```

其中：
- $x$ 返回决策向量的取值
- $fval$ 返回目标函数的最优值
- $f$ 为价值向量
- $A,b$ 对应线性不等式约束
- $Aeq,beq$ 对应线性等式约束
- $lb$ 和 $ub$ 分别对应决策向量的下界向量和上界向量

这种方法简单但是不够灵活，所以一般用基于问题求解可以更加适用于其他类型问题，普遍解法。

>[!example] 线性规划Matlab求解
>$$\max\ z = 4x_1 + 3x_2$$
>$$\text{s.t.} \begin{cases} 2x_1 + x_2 \leq 10 \\ x_1 + x_2 \leq 8 \\ x_2 \leq 7 \\ x_1, x_2 \geq 0 \end{cases}$$

>[!success] 求解器求解
>```matlab
>c=[-4;-3];
>A=[2,1;1,1;0,1];
>b=[10;8;7];
>Aeq=[];
>beq=[];
>lb=zeros(2,1);
>%无ub
>[x,fval]=linprog(c,A,b,Aeq,beq,lb);
>y=-fval;
>x
>y
>```
>[`linprog`文档](https://www.mathworks.com/help/releases/R2024b/optim/ug/linprog.html)

>[!success] 基于问题求解（推荐）
>```matlab
>p=optimproblem('ObjectiveSense','max');
c=[4;3];
A=[2,1;1,1;0,1];
b=[10;8;7];
x=optimvar('x',2,'LowerBound',[0;0]);
p.Objective=c'*x;
p.Constraints.con1=A*x<=b;
[sol,fval,flag,out]=solve(p);
sol.x
>fval
>```
>[`optimproblem`文档](https://ww2.mathworks.cn/help/releases/R2024b/optim/ug/optimproblem.html)

很明显，基于问题的解法无需将问题化为标准型，相对灵活。
## python求解

python也可以用`linprog`求解，与Matlab类似，不再赘述，这里简单介绍一下用`PuLP`求解。

>[!success] Python求解（推荐）
>```python
>import pulp
>#创建问题（指定最大化）
>prob = pulp.LpProblem("LinearProgramExample", pulp.LpMaximize)
>#定义变量（x1,x2≥0）
x1 = pulp.LpVariable("x1", 0)
x2 = pulp.LpVariable("x2", lowBound=0)
>#目标函数
prob += 4*x1 + 3*x2, "MaxZ"
>#约束条件
prob += 2*x1 + x2 <= 10
prob += x1 + x2 <= 8
>prob += x2 <= 7
>#求解（默认调用CBC求解器）
>prob.solve()
>print("求解状态：", pulp.LpStatus[prob.status])
print("最优解 x1,x2：", x1.varValue, x2.varValue)
print("最优目标值 z：", pulp.value(prob.objective))
>```

可见，Python解法最直观，推荐。

## Lingo求解

Lingo是专门用来求解线性规划的软件，但是一般情况Matlab和python就够了，我就暂时不学了，这里不再详细介绍，文档参考[[LINGO.pdf|官方文档]]，视频入门[Lingo一小时速成](https://www.bilibili.com/video/BV17T4y1K7sL/?spm_id_from=333.337.search-card.all.click&vd_source=9fdbda55fdd2c109918c0d744e6a7f7e)。
