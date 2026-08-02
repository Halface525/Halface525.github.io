---
data: 2026-01-17
tags:
  - 机器学习
  - 西瓜书
lastdate: 2026-01-18
auther: Gemini & Halfcae
---

# 1. 线性模型基本形式

线性模型 (linear model) 是机器学习领域中至关重要的一类基础模型。它的战略意义不仅在于其形式简单、易于建模，更在于其强大的可解释性（comprehensibility），这使得模型决策过程直观易懂。同时，线性模型也是构建许多功能更强大的非线性模型 (nonlinear model) 的重要基石，这些复杂模型往往可在线性模型的基础上通过引入层级结构或高维映射而得。

线性模型旨在通过属性的线性组合来构建一个预测函数。其通用向量形式可以表示为：

$$f(\boldsymbol{x}) = \boldsymbol{w}^T\boldsymbol{x} + b$$

其中：

- $\boldsymbol{x} = (x_1; x_2; ...; x_d)$ 是由 _d_ 个属性（或特征）描述的示例。
- $\boldsymbol{w} = (w_1; w_2; ...; w_d)$是权重向量 (weight vector)，其中的每个分量$w_i$直观地表达了对应属性 $x_i$ 在预测中的重要性。
- b 是偏置项 (bias term)，有时也被称为截距。

线性模型最核心的优势之一在于其出色的**可解释性**。权重向量 $\boldsymbol{w}$ 的大小直观地反映了不同特征对于预测结果的贡献程度。例如，在判断一个西瓜是否为好瓜的任务中，如果我们学得的模型是：

`f_好瓜(x) = 0.2 * x_色泽 + 0.5 * x_根蒂 + 0.3 * x_敲声 + 1`

这个模型清晰地告诉我们：

1. **特征重要性**：`根蒂` 的权重最高（0.5），说明它是最重要的判断依据。`敲声` 的重要性次之（0.3），而 `色泽` 的影响相对最小（0.2）。
2. **决策逻辑**：通过综合考量这三个特征的取值，模型可以得出一个预测分值，从而判断瓜的好坏。

这种清晰的对应关系使得线性模型的结果易于理解和分析。这种看似简单的线性组合是监督学习的基石。根据预测任务是输出连续值还是离散类别，线性模型可以分别演化为我们接下来将要讨论的线性回归与分类模型。

--------------------------------------------------------------------------------

# 2. 线性回归 (Linear Regression)

线性回归是线性模型最典型和基础的应用之一，其核心目标是学习一个线性模型，使其能够尽可能准确地预测出实数值的输出标记。

## 2.1 单变量线性回归 (Univariate Linear Regression)

在最简单的情况下，我们只考虑单个输入属性。给定数据集$D = \{(x_i, y_i)\}_{i=1}^m$，单变量线性回归试图学习一个函数：

$$f(x_i) = wx_i + b, \quad \text{使得} \quad f(x_i) \approx y_i$$

这里的核心问题是如何确定参数 `w` 和 `b`。解决方案是采用**最小二乘法 (least square method)**。该方法旨在寻找一组参数 `(w, b)`，以**最小化均方误差 (mean squared error)**，即所有样本的预测值与真实值之差的平方和。从几何角度看，这相当于找到一条直线，使得所有样本点到该直线的**垂直距离（即y轴方向上的差值）的平方和**最小。

均方误差最小化的目标函数为：

$$(w^*, b^*) = \underset{(w,b)}{\arg\min} \sum_{i=1}^{m} (f(x_i) - y_i)^2 = \underset{(w,b)}{\arg\min} \sum_{i=1}^{m} (y_i - wx_i - b)^2$$

由于该目标函数是关于 `w` 和 `b` 的凸函数，通过分别对其求偏导并令导数为零，可以得到最优解的**闭式解 (closed-form solution)**：

$$w = \frac{\sum_{i=1}^{m} y_i(x_i - \bar{x})}{\sum_{i=1}^{m} x_i^2 - \frac{1}{m}(\sum_{i=1}^{m} x_i)^2}$$

$$b = \frac{1}{m} \sum_{i=1}^{m} (y_i - wx_i)$$

其中，$\bar{x} = \frac{1}{m} \sum_{i=1}^{m} x_i$ 是 `x` 的均值。

## 2.2 多元线性回归 (Multivariate Linear Regression)

当样本由 `d` 个属性描述时，单变量线性回归自然地扩展为多元线性回归。为了便于计算，通常采用基于矩阵的表示方法。

我们将权重向量 $\boldsymbol{w}$ 和偏置项 b 合并为一个增广权重向量 $\boldsymbol{\hat{w}} = (\boldsymbol{w}; b)$。相应地，将数据集表示为一个 $m \times (d+1)$ 的增广特征矩阵 $\mathbf{X}$，其中每一行代表一个样本，前 `d` 列是样本的属性值，最后一列恒为1。标签则表示为向量 $\boldsymbol{y}$。

- **增广权重向量**: $\boldsymbol{\hat{w}} = (w_1; w_2; ...; w_d; b)$
- **增广特征矩阵**: $\mathbf{X} = \begin{pmatrix} x_{11} & x_{12} & \dots & x_{1d} & 1 \\ x_{21} & x_{22} & \dots & x_{2d} & 1 \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ x_{m1} & x_{m2} & \dots & x_{md} & 1 \end{pmatrix} = \begin{pmatrix} \boldsymbol{x}_1^\mathrm{T} & 1 \\ \boldsymbol{x}_2^\mathrm{T} & 1 \\ \vdots & \vdots \\ \boldsymbol{x}_m^\mathrm{T} & 1 \end{pmatrix}$
- **标签向量**: $\boldsymbol{y} = (y_1; y_2; ...; y_m)$

此时，多元线性回归的最小二乘目标函数可以写为：

$$\boldsymbol{\hat{w}}^* = \underset{\boldsymbol{\hat{w}}}{\arg\min} (\boldsymbol{y} - \mathbf{X}\boldsymbol{\hat{w}})^T(\boldsymbol{y} - \mathbf{X}\boldsymbol{\hat{w}})$$

对 $\boldsymbol{\hat{w}}$ 求导并令其为零，可得最优解的闭式形式：

$$\boldsymbol{\hat{w}}^* = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\boldsymbol{y}$$

然而，在现实任务中，矩阵 $\mathbf{X}^T\mathbf{X}$ 常常**不是满秩矩阵**。例如，在许多任务中我们遇到的变量（特征）数量甚至超过了样例数量，导致X的列数多于行数，此时$\mathbf{X}^T\mathbf{X}$显然不满秩。这意味着存在多个解$\boldsymbol{\hat{w}}$ 都可以使均方误差最小化。此时，具体选择哪个解将由学习算法的**归纳偏好**决定。解决此问题的一个常见方法是引入**正则化 (regularization)** 项。

## 2.3 广义线性模型 (Generalized Linear Models)

线性回归模型虽然简单，但通过引入一个非线性函数，可以扩展其建模能力，使其能够逼近非线性的关系。

一个典型的例子是**对数线性回归 (log-linear regression)**：

$\ln y = \boldsymbol{w}^T\boldsymbol{x} + b$

从形式上看，它仍然是线性回归，但实质上它是在尝试让 $e^{\boldsymbol{w}^T\boldsymbol{x} + b}$逼近真实标签 `y`，从而实现了从输入空间到输出空间的非线性函数映射（如**图 3.1** 所示）。

将这个思想进行推广，就得到了**广义线性模型 (Generalized Linear Model)**。其通用形式为：

$y = g^{-1}(\boldsymbol{w}^T\boldsymbol{x} + b)$

在这里，函数 g(\cdot) 被称为**联系函数 (link function)**，它必须是单调可微的。它的作用是在线性预测值 $\boldsymbol{w}^T\boldsymbol{x} + b$ 与真实输出标记 `y` 之间建立联系。例如，对数线性回归就是广义线性模型在 $g(\cdot) = \ln(\cdot)$ 时的特例。

通过选择不同的联系函数，广义线性模型框架可以灵活地应用于不同类型的预测任务，包括接下来将要讨论的分类任务。

--------------------------------------------------------------------------------

# 3. 对数几率回归 (Logistic Regression)

对数几率回归（常被称为逻辑回归）是一种经典的**分类**方法，它虽然名字中带有“回归”，但其本质是利用广义线性模型的框架来解决分类问题。(值得注意的是，虽然该模型常被称为“逻辑回归”，但“逻辑”一词与“logistic”的数学含义相去甚远，“对数几率回归”是更精确的意译。)

## 3.1 模型形式与推导

分类任务的核心挑战是如何将线性模型产生的连续预测值 $z = \boldsymbol{w}^T\boldsymbol{x} + b$ 映射到离散的类别标签上（例如二分类中的 {0, 1}）。

最理想的映射函数是**单位阶跃函数 (unit-step function)**，它直接将小于零的值映为0，大于零的值映为1。然而，这个函数是不连续的，无法直接用于优化。

因此，我们需要一个连续可微的替代函数来近似它。**对数几率函数 (logistic function)** 是一个理想的选择：

$$y = \frac{1}{1 + e^{-z}}$$

对数几率函数是一种 **Sigmoid 函数**，它平滑、连续且任意阶可导，能够将任意实数 `z` 映射到 (0, 1) 区间，并且在 `z=0` 附近变化很陡峭，形态上非常接近单位阶跃函数。 ^971b3c

将对数几率函数作为联系函数 $g^{-1}(\cdot)$ $代入广义线性模型，我们便得到了对数几率回归模型：

$$y = \frac{1}{1 + e^{-(\boldsymbol{w}^T\boldsymbol{x} + b)}}$$

通过简单的代数变换，上式可以改写为：

$$\ln\frac{y}{1-y} = \boldsymbol{w}^T\boldsymbol{x} + b$$

这里的 $\frac{y}{1-y}$ 称为**几率 (odds)**，它反映了样本作为正例的相对可能性。对其取对数，便得到**对数几率 (log odds 或 logit)**。上式清晰地表明，对数几率回归模型实际上是在用一个线性组合的预测结果去逼近真实标记的对数几率。

## 3.2 模型优点与参数估计

对数几率回归模型具备多项优良特性，使其成为应用最广泛的分类算法之一：

- **直接建模概率**：它直接对分类的概率进行建模，而无需事先假设数据的分布，从而避免了因假设不准确而带来的问题。
- **输出概率值**：模型输出的是一个近似的概率预测值，而不仅仅是一个离散的类别标签，这对于需要利用概率进行辅助决策的任务非常有用。
- **优秀的数学性质**：其目标函数（基于对数几率函数）是一个高阶可导的连续**凸函数**，这保证了优化过程不会陷入局部最优，现有的多种数值优化算法（如梯度下降法、牛顿法）都可以直接用于求解其最优解。

模型的参数 $\boldsymbol{w}$ 和 b 通常通过**极大似然法 (maximum likelihood method)** 来估计。其核心思想是找到一组参数，使得在该参数下，数据集中所有样本属于其真实标记的概率之积最大。

对应的对数似然函数为：

$$l(\boldsymbol{w}, b) = \sum_{i=1}^{m} \ln p(y_i | \boldsymbol{x_i}; \boldsymbol{w}, b)$$

为便于讨论，令$\boldsymbol{\beta} = (\boldsymbol{w}; b)$，并相应地将输入样本 $\boldsymbol{x}$ 增广为 $\boldsymbol{\hat{x}} = (\boldsymbol{x}; 1)$。这样，$\boldsymbol{w}^T\boldsymbol{x} + b$ 就可以简写为 $\boldsymbol{\beta}^T\boldsymbol{\hat{x}}$。最大化此对数似然函数，等价于最小化以下损失函数：

$$l(\boldsymbol{\beta}) = \sum_{i=1}^{m} (-y_i\boldsymbol{\beta}^T\boldsymbol{\hat{x}}_i + \ln(1 + e^{\boldsymbol{\beta}^T\boldsymbol{\hat{x}}_i}))$$

由于该损失函数是高阶可导的连续凸函数，可以使用**牛顿法**等数值优化算法高效地求解。牛顿法的更新公式依赖于目标函数的一阶和二阶导数：

- **一阶导数**: $\frac{\partial l(\boldsymbol{\beta})}{\partial \boldsymbol{\beta}} = - \sum_{i=1}^m \boldsymbol{\hat{x}}_i (y_i - p_1(\boldsymbol{\hat{x}}_i; \boldsymbol{\beta}))$
- **二阶导数**: $\frac{\partial^2 l(\boldsymbol{\beta})}{\partial \boldsymbol{\beta} \partial \boldsymbol{\beta}^T} = \sum_{i=1}^m \boldsymbol{\hat{x}}_i \boldsymbol{\hat{x}}_i^T p_1(\boldsymbol{\hat{x}}_i; \boldsymbol{\beta})(1-p_1(\boldsymbol{\hat{x}}_i; \boldsymbol{\beta}))$

通过迭代更新，最终可以收敛到最优的参数解。

--------------------------------------------------------------------------------

# 4. 线性判别分析 (Linear Discriminant Analysis - LDA)

线性判别分析（LDA），又称“费雪判别分析 (Fisher discriminant analysis)”，是另一种经典的线性分类方法。

LDA的核心思想非常直观：将数据点投影到一个**由向量 w 定义的**直线上，使得同类别的点的投影尽可能地靠近，而不同类别的点的投影尽可能地远离。如**图 3.3** 所示，当新的样本点被投影到这条线上时，我们可以根据其投影位置来确定它的类别。

为了将这一直观思想数学化，我们需要定义两个目标：

1. **最小化类内协方差 (Minimize Intra-class Covariance)**：为了让同类样本的投影点尽可能聚集，我们需要最小化每个类别内部投影点的协方差。对于二分类问题，这个目标可以表示为最小化
$$\boldsymbol{w}^T\Sigma_0\boldsymbol{w} + \boldsymbol{w}^T\Sigma_1\boldsymbol{w}$$
2. **最大化类间距离 (Maximize Inter-class Distance)**：为了让不同类别样本的投影点尽可能分离，我们需要最大化两个类别中心点在投影线上的距离。这个目标可以表示为最大化 $$||\boldsymbol{w}^T\boldsymbol{\mu}_0 - \boldsymbol{w}^T\boldsymbol{\mu}_1||_2^2$$

综合考虑这两个目标，LDA 旨在找到一个投影方向 $\boldsymbol{w}$，以最大化类间距离与类内协方差的比值。这个优化目标函数 `J` 可以表示为：

$$J = \frac{||\boldsymbol{w}^T\boldsymbol{\mu}_0 - \boldsymbol{w}^T\boldsymbol{\mu}_1||_2^2}{\boldsymbol{w}^T\Sigma_0\boldsymbol{w} + \boldsymbol{w}^T\Sigma_1\boldsymbol{w}}$$

通过求解这个最优化问题，即可确定最佳的投影方向，从而构建出 LDA 分类器。

# 5. 多分类学习

1. OvO：需要训练$N(N-1)/2$个分类器，一个正一个反
2. OvR(OvA)：只要训练N个，一个正其余反
3. MvM：若干正若干反