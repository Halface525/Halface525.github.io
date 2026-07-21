---
data: 2025-12-21
tags:
  - 数学建模
  - 整数规划
lastdate: 2025-12-21
---
同样在运筹学中详细学习过，这里只做简单回顾与matlab和python的建模方法记录。

# 模型

按决策变量的取值范围来看可以有三类。

| 类型      | 决策变量       |
| ------- | ---------- |
| 纯整数规划   | 都是整数       |
| 混合整数规划  | 一部分整数一部分不是 |
| 0-1整数规划 | 只能取0或者1    |

一般形式：
$$ \begin{gathered} \max(\text{或 } \min) \ z = \sum_{j=1}^{n} c_j x_j, \\ \text{s.t.} \quad \begin{cases} \sum_{j=1}^{n} a_{ij} x_j \leq (\text{或 } =, \geq) \ b_i, & i = 1,2,\cdots,m, \\ x_j \geq 0, & j = 1,2,\cdots,n, \\ x_1, x_2, \cdots, x_n \text{ 中部分或全部取整数}. \end{cases} \end{gathered} $$

主要能解决的问题有背包问题、指派问题、货郎担问题等等，不一一介绍。
使用0-1变量使得非线性条件线性化是一个很常见的方法，也不详细说明。

# 求解


>[!example] 整数规划问题
>为了生产的需要，某工厂的-条生产线需要每天24h不间断运转，但是每天不同时间段所需要的工人最低数量不同,具体数据如表所示。已知每名工人的连续工作时间为8h。则该工厂应该为该生产线配备多少名工人才能保证生产线的正常运转？

| 班次   | 1         | 2         | 3          | 4           | 5           | 6           |
| ---- | --------- | --------- | ---------- | ----------- | ----------- | ----------- |
| 时间段  | 0:00~4:00 | 4:00~8:00 | 8:00~12:00 | 12:00~16:00 | 16:00~20:00 | 20:00~24:00 |
| 工人数量 | 35        | 40        | 50         | 45          | 55          | 30          |

> [!success] 建立模型
>$$ \begin{gathered} \min \ z = \sum_{i=1}^{6} x_i, \\ \text{s.t.} \quad \begin{cases} x_1 + x_6 \geq 35, \\ x_1 + x_2 \geq 40, \\ x_2 + x_3 \geq 50, \\ x_3 + x_4 \geq 45, \\ x_4 + x_5 \geq 55, \\ x_5 + x_6 \geq 30, \\ x_i \geq 0 \text{ 且为整数},\ i=1,2,\cdots,6 \end{cases} \end{gathered} $$

## Matlab求解

这里不像[[01线性规划#Matlab求解|线性规划]]可以用`linprog`求解，只介绍基于问题的解法（ps：`optimproblem`普遍解法很好用）。

> [!success] Matlab求解
> ```matlab
> clc, clear, prob = optimproblem;
>x = optimvar('x',6,'Type','integer','LowerBound',0);
>prob.Objective = sum(x);
>con = optimconstr(6);
>a = [35,40,50,45,55,30];
>con(1) = x(1)+x(6)>=35;
>for i = 1:5
>    con(i+1) = x(i)+x(i+1)>=a(i+1);
>end
>prob.Constraints.con = con;
>[sol, fval, flag] = solve(prob), sol.x
>```

同理，如果是0-1变量的话就让`Type`是`binary`就好，[书](zotero://open-pdf/library/items/A8TRE7M4?page=32&annotation=AJKKC6VD)  里面写`LowerBound=0, UpperBound=1`有点麻烦。

## python求解

和上节一样使用`PuLP`库。

> [!success] python求解
> ```python
import pulp as pl
># 1. 创建整数线性规划问题（最小化目标函数，对应MATLAB的min sum(x)）
>prob = pl.LpProblem("WorkerSchedulingProblem", pl.LpMinimize)
>
># 2. 定义优化变量：6个整数变量x1-x6，下界为0（对应MATLAB的Type='integer', LowerBound=0）
>x = [pl.LpVariable(f"x{i+1}", lowBound=0, cat=pl.LpInteger) for i in range(6)]  # x1~x6
>
># 3. 定义目标函数：sum(x)（对应MATLAB的prob.Objective = sum(x)）
>prob += pl.lpSum(x), "TotalWorkers"
>
># 4. 定义约束条件（对应MATLAB的con数组）
a = [35, 40, 50, 45, 55, 30]
># 约束1：x1 + x6 >= 35
>prob += x[0] + x[5] >= a[0], "Constraint1"
># 约束2~6：x(i) + x(i+1) >= a(i+1)（i从1到5，对应x1+x2>=40, x2+x3>=50...）
>for i in range(5):
>    prob += x[i] + x[i+1] >= a[i+1], f"Constraint{i+2}"
>    
># 5. 求解问题（使用默认的CBC求解器）
status = prob.solve()
>
># 6. 输出结果
>print(f"求解状态：{pl.LpStatus[status]}")  # 输出是否最优
>print(f"目标函数值（最小总人数）：{pl.value(prob.objective)}")
>print("变量取值：")
>for var in x:
>    print(f"{var.name} = {pl.value(var)}")
> ```

似乎麻烦一点？关键字太长太多了，好在实际编程由ai完成，能看懂就行了。

# 蒙特卡洛法

也称为计算机随机模拟法，是基于对大量事件的统计结果来实现一些确定性问题的计算（大量投色子）。

对于非线性整数规划目前尚未有成熟、准确的求解方法，因为非线性规划本身的通用有效解尚未找到，更何况是非线性整数规划。

但是好在整数解是有限个，所以枚举法完全可以求解，在范围过大的时候蒙特卡洛法就很好了。