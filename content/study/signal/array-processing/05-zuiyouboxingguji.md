---
data: 2026-08-03
tags:
  - 阵列处理
  - 信号处理
  - 最优波束形成
lastdate: 2026-08-03
auther: Halface
---
第 2–4 章学习如何设计波束方向图：给定阵列几何与权值可计算方向图，给定期望方向图可合成权值——这是**确定性**的设计问题。第 5 章转向**统计**世界：信号与噪声被建模为随机过程，用空间谱矩阵 $\mathbf{S}_x$ 描述。本章把二者结合起来，回答一个核心问题：**已知信号与噪声的统计特性（$\mathbf{S}_x$ 或 $\mathbf{S}_n$），如何设计波束形成器使其在某种统计意义下最优**？

具体地，本章要处理四类问题：信号是已知方向的未知非随机信号时如何估计其波形（MVDR）；信号本身是随机过程时如何估计（MMSE）；只知道总观测统计、不知道信号噪声如何分离时如何设计（MPDR）；以及模型失配时如何保证性能（稳健波束形成）。这四种信号模型在矩阵操作上惊人地一致——**前三种都回到 MVDR 波束形成器 $\mathbf{w} \propto \mathbf{S}_n^{-1}\mathbf{v}_s$，区别仅在后续的标量处理**。理解了这一个公式，就抓住了本章的骨架。

随后章节沿"问题复杂度"展开：从单个干扰到多个干扰、到空间连续分布的干扰、到多个感兴趣的信号；再从理想模型走向现实（失配与稳健化：对角加载、线性约束、特征空间、波束空间、二次型与软约束、空间平滑、宽带）。对应原书第 6 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 6.1** 本章符号表（Notation）

| 符号 | 含义与说明 |
| --- | --- |
| **信号与谱矩阵 / Signals and Spectral Matrices** | |
| $F(\omega)$ | 源信号（source signal），可为未知非随机或随机过程 |
| $\mathbf{X}(\omega)$ | 阵列观测矢量，$\mathbf{X} = \mathbf{v}_s F + \mathbf{N}$ |
| $\mathbf{S}_n$ | 噪声谱矩阵（noise spectral matrix） |
| $\mathbf{S}_x$ | 阵列观测谱矩阵（$\mathbf{S}_x = \mathbf{S}_f \mathbf{v}_s\mathbf{v}_s^H + \mathbf{S}_n$） |
| $\mathbf{S}_f$ | 信号谱矩阵（signal spectral matrix） |
| $S_f(\omega)$ | 标量信号功率谱 |
| $\sigma_w^2$ | 白噪声功率 |
| $S_j$ | 干扰功率（interference power） |
| **导向矢量 / Steering Vectors** | |
| $\mathbf{v}_s$ | 真实信号导向矢量（$\mathbf{k}_s$ 方向） |
| $\mathbf{v}_m$ | 模型（假设）信号导向矢量 |
| $\mathbf{v}_a$ | 实际信号导向矢量（失配分析用） |
| $\mathbf{v}_j$ | 干扰导向矢量 |
| $\mathbf{V}_j$ | 干扰流形矩阵 |
| $B_{sj}$ | 空间相关系数，$B_{sj} = \frac{1}{N}\mathbf{v}_s^H\mathbf{v}_j$ |
| **波束形成器 / Beamformers** | |
| $\mathbf{w}$ | 权重向量，输出 $Y = \mathbf{w}^H\mathbf{X}$ |
| $\mathbf{W}$ | 矩阵处理器（多信号），输出 $\mathbf{Y} = \mathbf{W}^H\mathbf{X}$ |
| $\mathbf{w}_{mvdr}, \mathbf{w}_{mmse}, \mathbf{w}_{mpdr}$ | 各类最优波束形成器 |
| $A_o$ | 最优阵列增益，$A_o = \mathbf{v}_s^H\mathbf{S}_n^{-1}\mathbf{v}_s$ |
| $A_c$ | 常规（均匀加权）阵列增益 |
| $M$ | 最优 SNR（失配分析中 $M = \mathbf{v}_a^H\mathbf{S}_n^{-1}\mathbf{v}_a$） |
| $\alpha$ | 对角加载量（loading level） |
| $\beta$ | 二次型约束的 Lagrange 乘子 |
| **线性约束 / Linear Constraints** | |
| $\mathbf{C}$ | 约束矩阵（constraint matrix），$N \times M_c$ |
| $\mathbf{g}$ | 约束响应向量（constraint response） |
| $\mathbf{w}_q$ | GSC 静态权值（quiescent weight） |
| $\mathbf{B}$ | GSC 阻塞矩阵（blocking matrix），$N \times (N-M_c)$ |
| $\mathbf{w}_a$ | GSC 自适应权值 |
| **特征空间 / Eigenspace** | |
| $\lambda_i, \boldsymbol{\phi}_i$ | 特征值 / 特征向量 |
| $\mathbf{U}_s$ | 信号子空间基 |
| $D_s$ | 信号子空间维数 |
| $\mathbf{v}_{\text{proj}}$ | 投影到信号子空间的导向矢量 |
| **波束空间 / Beamspace** | |
| $\mathbf{B}_{bs}$ | 波束空间矩阵，$N \times N_{bs}$ |
| $\mathbf{S}_{x,bs}, \mathbf{v}_{bs}$ | 波束空间谱矩阵 / 导向矢量 |
| **空间平滑 / Spatial Smoothing** | |
| $L$ | 子阵个数 |
| $M$ | 子阵长度（$M > D$） |
| $\mathbf{J}$ | 交换矩阵（exchange matrix） |
| $\mathbf{S}_{ss}, \mathbf{S}_{fbss}$ | 空间平滑 / 前后向平滑协方差 |
| **软约束 / Soft Constraints** | |
| $\Omega$ | 约束区域 |
| $\mathbf{Q}$ | 区域积分矩阵，$\mathbf{Q} = \int_\Omega \mathbf{v}(\psi)\mathbf{v}^H(\psi)\,\mathrm{d}\psi$ |
| $\mathbf{w}_d$ | 期望权值（desired weight） |
| **宽带 / Broadband** | |
| $L$（FIR） | FIR 滤波器长度 |
| $w_{n,m}$ | FIR 宽带权值 |
| $\tilde{\mathbf{x}}(k)$ | 延迟堆积数据矢量（$NL \times 1$） |

---

## 6.1 最优波束形成器（Optimum Beamformers）

本章讨论四种信号模型下的最优线性波束形成器。它们共享"**约束 + 最小化**"的数学结构：先对波束形成器施加一个或多个保证信号方向的约束，再在满足约束的前提下最小化某个与噪声/输出功率有关的量。四种模型的对比如下：

**表 6.2** 四种信号模型与对应的波束形成器

| 模型 | 信号 | 噪声 | 已知量 | 波束形成器 |
| --- | --- | --- | --- | --- |
| MVDR | 非随机，方向已知 | 随机，$\mathbf{S}_n$ 已知 | $\mathbf{S}_n, \mathbf{v}_s$ | 最小方差无畸变 |
| MMSE | 随机，已知 $\mathbf{S}_f$ | 随机，$\mathbf{S}_n$ 已知 | $\mathbf{S}_n, \mathbf{S}_f, \mathbf{v}_s$ | 最小均方误差 |
| 最大 SNR | 随机或非随机 | 随机，$\mathbf{S}_n$ 已知 | $\mathbf{S}_n, \mathbf{v}_s$ | 最大信噪比 |
| MPDR | 任意 | 仅知 $\mathbf{S}_x$ | $\mathbf{S}_x, \mathbf{v}_m$（模型方向） | 最小功率无畸变 |

注意前三种模型都要求噪声谱矩阵 $\mathbf{S}_n$ 已知（意味着存在"无信号时"的数据来估计噪声统计），且都知道信号方向 $\mathbf{v}_s$；只有 MPDR 退而求其次，只用总观测谱 $\mathbf{S}_x$ 与一个模型方向 $\mathbf{v}_m$。这个区别决定了后面失配问题的严重性。

### 6.1.1 MVDR 波束形成器

**问题设定。** 信号是从方向 $\mathbf{k}_s$ 入射的平面波：

$$
\mathbf{X}(\omega) = \mathbf{v}(\omega,\mathbf{k}_s)\, F(\omega) + \mathbf{N}(\omega),
$$

其中 $F(\omega)$ 是源信号，**未知非随机**（或确定性）——我们的目标是估计 $F(\omega)$，即**复制信号的波形**；$\mathbf{N}(\omega)$ 是零均值 Gauss 噪声，谱矩阵 $\mathbf{S}_n(\omega)$ 已知。

> **定义 6.1**（无畸变约束 / Distortionless Constraint）：要求波束形成器对信号方向的增益为 1：
>
> $$
> \mathbf{w}^H \mathbf{v}_s = 1.
> $$

**为什么这个约束是合理的？** 波束形成器 $\mathbf{w}^H$ 对观测 $\mathbf{X}$ 做线性处理，输出 $Y = \mathbf{w}^H\mathbf{X}$。若无畸变约束满足，则无论 $F(\omega)$ 取什么值，都有

$$
Y = \underbrace{\mathbf{w}^H\mathbf{v}_s}_{=1} F(\omega) + \mathbf{w}^H\mathbf{N} = F(\omega) + \mathbf{w}^H\mathbf{N},
$$

信号分量被**完整保留**，而噪声分量被加权组合——波束形成器退化成一个纯粹的"噪声处理器"，任务变成选择 $\mathbf{w}$ 使噪声输出功率最小。

> **定理 6.1**（MVDR 最优解）：在无畸变约束下最小化输出噪声功率 $P_n = \mathbf{w}^H\mathbf{S}_n\mathbf{w}$。用 Lagrange 乘子法，令
>
> $$
> L = \mathbf{w}^H\mathbf{S}_n\mathbf{w} + \lambda(\mathbf{w}^H\mathbf{v}_s - 1) + \lambda^*(\mathbf{v}_s^H\mathbf{w} - 1),
> $$
>
> 对 $\mathbf{w}^H$ 求梯度并令其为零得 $\mathbf{S}_n\mathbf{w} + \lambda\mathbf{v}_s = 0$，即 $\mathbf{w} = -\lambda\mathbf{S}_n^{-1}\mathbf{v}_s$；代回约束 $\mathbf{v}_s^H\mathbf{w} = 1$ 解出 $\lambda = -1/(\mathbf{v}_s^H\mathbf{S}_n^{-1}\mathbf{v}_s)$，最终
>
> $$
> \boxed{\mathbf{w}_{mvdr} = \frac{\mathbf{S}_n^{-1}\mathbf{v}_s}{\mathbf{v}_s^H\mathbf{S}_n^{-1}\mathbf{v}_s}}.
> $$

> **定理 6.2**（MVDR 的白化-匹配-归一化结构与阵列增益）：把 $\mathbf{w}_{mvdr}$ 拆成三步理解：
>
> ① **白化**：$\mathbf{S}_n^{-1/2}$ 把相关噪声变成白噪声；② **匹配**：$\mathbf{S}_n^{-1/2}\mathbf{v}_s$ 是白化后的导向矢量，对它做匹配滤波；③ **归一化**：比例因子保证无畸变。
>
> **这为什么是最优的？** 白噪声中匹配滤波器是最优的（最大化 SNR）。MVDR 先把有色噪声白化，再做匹配滤波——正是匹配滤波器的推广。最优阵列增益 $A_o = \mathbf{v}_s^H\mathbf{S}_n^{-1}\mathbf{v}_s$；常规（均匀加权 $\mathbf{w} = \mathbf{v}_s/N$）阵列增益 $A_c = N^2/(\mathbf{v}_s^H\mathbf{S}_n\mathbf{v}_s)$。对白噪声 $\mathbf{S}_n = \sigma_w^2\mathbf{I}$，二者相等 $A_o = A_c = N$——**在均匀白噪声中，常规波束形成器就是最优的**。

### 6.1.2 MMSE 波束形成器

**问题设定。** 现在信号 $F(\omega)$ 也是随机过程，功率谱为 $S_f(\omega)$，且与噪声不相关。观测仍为 $\mathbf{X} = \mathbf{v}_s F + \mathbf{N}$。目标是找线性估计器 $\hat{F} = \mathbf{w}^H\mathbf{X}$，使均方误差最小。

> **定义 6.2**（MMSE 估计）：最小化 $\mathcal{E} = E\left[|F - \mathbf{w}^H\mathbf{X}|^2\right]$，最优解为 Wiener 解
>
> $$
> \mathbf{w}_o = \mathbf{S}_x^{-1}\mathbf{S}_{xd},
> $$
>
> 其中 $\mathbf{S}_{xd} = E[\mathbf{X}F^*] = S_f\mathbf{v}_s$ 是观测与信号的互相关，$\mathbf{S}_x = S_f\mathbf{v}_s\mathbf{v}_s^H + \mathbf{S}_n$ 是观测协方差。

> **定理 6.3**（MMSE = MVDR + 标量增益）：把 Wiener 解代入 $\mathbf{S}_x = S_f\mathbf{v}_s\mathbf{v}_s^H + \mathbf{S}_n$，利用矩阵求逆引理展开，
>
> $$
> \mathbf{w}_{mmse} =
> \underbrace{\frac{\mathbf{S}_n^{-1}\mathbf{v}_s}{\mathbf{v}_s^H\mathbf{S}_n^{-1}\mathbf{v}_s}}_{\mathbf{w}_{mvdr}}
> \cdot \underbrace{\frac{S_f\,\mathbf{v}_s^H\mathbf{S}_n^{-1}\mathbf{v}_s}{1 + S_f\,\mathbf{v}_s^H\mathbf{S}_n^{-1}\mathbf{v}_s}}_{\text{标量增益}},
> $$
>
> **结构 = MVDR 波束形成器 × 标量增益**。物理意义：先用 MVDR 得到 $\hat{F}_{mvdr}$，再乘以一个介于 0 与 1 之间的标量增益 $\alpha$——信噪比很低时 $\alpha \to 0$（几乎不相信观测，把它当作先验均值 0），信噪比很高时 $\alpha \to 1$（充分相信观测）。**这与时域 Wiener 滤波完全对应**：标量增益就是空域 Wiener 滤波器的频率响应。

### 6.1.3 最大信噪比波束形成器

**问题设定。** 最大化输出信噪比：

$$
SNR_o = \frac{\mathbf{w}^H\mathbf{S}_{xs}\mathbf{w}}{\mathbf{w}^H\mathbf{S}_n\mathbf{w}},
\qquad \mathbf{S}_{xs} = S_f\mathbf{v}_s\mathbf{v}_s^H,
$$

其中 $\mathbf{S}_{xs}$ 是信号分量的谱矩阵（秩 1）。

> **定理 6.4**（最大 SNR 解与 MVDR 等价）：这是**广义 Rayleigh 商**问题。最大值为矩阵 $\mathbf{S}_n^{-1}\mathbf{S}_{xs}$ 的最大特征值，对应的特征向量为 $\mathbf{w} = \mathbf{S}_n^{-1}\mathbf{v}_s$——**与 MVDR 波束形成器完全相同**（只差一个不影响 SNR 的标量常数）。

### 6.1.4 MPDR 波束形成器

**与 MVDR 的区别。** MVDR 假设我们知道 $\mathbf{S}_n$（噪声谱矩阵），这需要**没有信号**时的数据来估计。MPDR 则假设只知道**总的** $\mathbf{S}_x$（信号 + 噪声），不知道如何分开——这在无法获得"纯噪声"数据时是唯一的选择。

> **定理 6.5**（MPDR 最优解）：在约束 $\mathbf{w}^H\mathbf{v}_m = 1$（$\mathbf{v}_m$ 是**模型**认为的信号方向）下，最小化输出总功率 $P_{out} = \mathbf{w}^H\mathbf{S}_x\mathbf{w}$：
>
> $$
> \mathbf{w}_{mpdr} = \frac{\mathbf{S}_x^{-1}\mathbf{v}_m}{\mathbf{v}_m^H\mathbf{S}_x^{-1}\mathbf{v}_m}.
> $$

**MPDR vs MVDR。** 当模型方向和真实信号方向**完全匹配**（$\mathbf{v}_m = \mathbf{v}_s$）时，$\mathbf{w}_{mpdr} = \mathbf{w}_{mvdr}$。但**不匹配**时 MPDR 会犯一个严重错误：因为 $\mathbf{S}_x = S_f\mathbf{v}_s\mathbf{v}_s^H + \mathbf{S}_n$，$\mathbf{S}_x^{-1}\mathbf{v}_m$ 会在 $\mathbf{v}_s$ 方向产生一个"零点"，把**信号当干扰消掉**。这正是第 6.5 节失配问题的出发点。

---

## 6.2 离散干扰（Discrete Interference）

实际环境中除了噪声，往往还有**离散的强干扰**（如来自某个方向的干扰机）。MVDR 会自动在干扰方向形成零陷，这是它最重要的行为之一。理解单干扰情形下的解，是理解 MVDR 全部行为的窗口。

### 6.2.1 单个平面波干扰

**模型。** 信号方向 $\mathbf{v}_s$、功率 $S_f$；干扰方向 $\mathbf{v}_j$、功率 $S_j$；白噪声功率 $\sigma_w^2$。噪声谱矩阵为

$$
\mathbf{S}_n = \sigma_w^2\mathbf{I} + S_j\mathbf{v}_j\mathbf{v}_j^H,
$$

即"白噪声 + 一个秩 1 的干扰分量"。

> **定理 6.6**（单干扰 MVDR 解与方向图几何）：利用矩阵求逆引理，MVDR 解为
>
> $$
> \mathbf{w}_{mvdr} \propto \mathbf{v}_s - \frac{N S_j/\sigma_w^2}{1 + N S_j/\sigma_w^2}\, B_{sj}\, \mathbf{v}_j,
> $$
>
> 其中 $B_{sj} = \frac{1}{N}\mathbf{v}_s^H\mathbf{v}_j$ 是常规波束方向图在干扰方向的值。波束方向图分解为
>
> $$
> B_{mvdr}(\mathbf{k}) = B_c(\mathbf{k}) - \alpha\, B_c^{(j)}(\mathbf{k}),
> \qquad \alpha = \frac{N S_j/\sigma_w^2}{1 + N S_j/\sigma_w^2}\, B_{sj},
> $$
>
> $B_c$ 是指向信号的常规波束，$B_c^{(j)}$ 是指向干扰的常规波束。**物理意义：最优方向图 = 信号方向的常规波束 − 干扰方向常规波束的某个倍数**。当干扰很强时 $\alpha \to B_{sj}$，方向图在干扰方向形成**几乎完全的零点**。

**三种区域的行为。** MVDR 方向图的行为强烈依赖干扰相对于主瓣的位置：

① **旁瓣区域**（干扰远离主瓣）：方向图几乎不变，只在干扰位置形成一个深零陷，阵列增益显著提高（改善约等于干扰噪声比 INR）——这是"无痛"的干扰抑制；

② **主波束区域**（干扰靠近主瓣）：方向图严重畸变、主瓣分裂，在信号方向（约束为 1）与干扰方向之间出现一个"驼峰"，且对信号 DOA 失配非常敏感——这是干扰抑制的代价区；

③ **HPBW 内**（干扰在主瓣内部）：波束形成器在干扰与信号之间"折中"，归一化方向图在信号方向为 1，但在干扰方向可能大于 1——此时无法同时保护两者，**这就是为什么需要主瓣保护**（第 6.6 节）。

![图 6.1：常规波束与 MVDR 波束方向图（N=10，干扰在 u_j=0.55）。MVDR 在干扰方向形成深零陷，SINR 由常规的 7.1 dB 提升到 19.9 dB。](../pic/ch6_MVDR方向图.png)

### 6.2.2 多个平面波干扰

**模型。** 推广到 $D$ 个干扰：$\mathbf{S}_n = \sigma_w^2\mathbf{I} + \mathbf{V}_j\mathbf{S}_j\mathbf{V}_j^H$，其中 $\mathbf{V}_j$ 为干扰流形矩阵，$\mathbf{S}_j$ 为干扰功率矩阵。

> **定理 6.7**（多干扰 MVDR 解）：MVDR 解为
>
> $$
> \mathbf{w}_{mvdr} \propto \mathbf{v}_s - \mathbf{V}_j\left(\frac{\sigma_w^2}{N}\mathbf{I} + \mathbf{S}_j\right)^{-1}\mathbf{S}_j\, \mathbf{P}_{js},
> $$
>
> 其中 $\mathbf{P}_{js} = \frac{1}{N}\mathbf{V}_j^H\mathbf{v}_s$ 是信号与各干扰的空间相关系数矢量。**结构 = 干扰子空间修正 + 信号方向**。等价地，当干扰很强时
>
> $$
> \mathbf{w}_{mvdr} \propto \mathbf{P}_{\mathbf{V}_j}^{\perp}\mathbf{v}_s,
> $$
>
> 即**把信号导向矢量投影到与所有干扰正交的子空间上**——MVDR 在极限情形下退化为一个"硬"正交投影：信号被保留，干扰分量被完全消除。

---

## 6.3 空域扩展干扰（Spatially Spread Interference）

**物理噪声模型。** 当干扰不是来自几个离散方向，而是来自**连续分布**（如海洋环境噪声、表面波浪噪声）时，空间谱矩阵不再低秩，而是具有特定的相关结构。各向同性噪声（来自所有方向均匀到达）：

$$
[\mathbf{S}_n]_{mn} = \sigma_n^2\, \operatorname{sinc}\!\left(\frac{2\pi}{\lambda}|\mathbf{p}_m - \mathbf{p}_n|\right),
$$

此时 MVDR 仍然是最优的，但波束方向图的旁瓣水平受噪声分布的影响。表面噪声（主要来自上半球）：

$$
[\mathbf{S}_n]_{mn} = \sigma_n^2\, \frac{\sin(k_0|\Delta\mathbf{p}|)}{k_0|\Delta\mathbf{p}|}\,(1 + \alpha\cos\theta_p),
$$

其中 $\theta_p$ 是两阵元连线方向与垂直方向的夹角。阵列增益取决于噪声的空间相关性：**强相关噪声**（来自同一方向，可被零陷抑制）容易处理，**弱相关噪声**（来自各个方向，无法定向抑制）则难以提升增益。

**ARMA 模型。** 用第 5.5 节的 AR 模型来描述空间扩展噪声：

> **定理 6.8**（AR 模型噪声的谱逆）：AR 噪声的谱矩阵之逆为**带状 Toeplitz 矩阵**，
>
> $$
> [\mathbf{S}_n^{-1}]_{ij} = \frac{1}{\sigma_u^2}\sum_{k} a(i-k)\,a^*(j-k),
> $$
>
> 因此 MVDR $\mathbf{w}_{mvdr} \propto \mathbf{S}_n^{-1}\mathbf{v}_s$ 可以用 AR 参数高效计算。**物理意义：MVDR 实际上在做空间白化**——先用 AR 滤波器对噪声做白化，再做匹配滤波；AR 参数越少，白化器越简单。

---

## 6.4 多个平面波信号（Multiple Plane-Wave Signals）

前面假设只有一个感兴趣的信号。若同时有 $D$ 个**感兴趣的信号**（来自不同方向），则需要一个 $D \times N$ 的矩阵处理器 $\mathbf{W}^H$，同时输出 $D$ 个波形估计。

> **定理 6.9**（矩阵 MVDR）：约束 $\mathbf{W}^H\mathbf{V}_s = \mathbf{I}_D$——第 $i$ 个波束对第 $i$ 个信号无畸变，对其余 $D-1$ 个信号设置**完全零点**。解为
>
> $$
> \mathbf{W}_{mvdr} = \left[\mathbf{V}_s^H\mathbf{S}_n^{-1}\mathbf{V}_s\right]^{-1}\mathbf{V}_s^H\mathbf{S}_n^{-1}.
> $$
>
> **结构：每个输出都是一个特定的 MVDR 波束形成器，把其他信号当成干扰。**

> **定理 6.10**（矩阵 MMSE）：当信号也是随机过程、源谱矩阵为 $\mathbf{S}_f$（$D\times D$）时，
>
> $$
> \mathbf{W}_{mmse} = \mathbf{S}_f\mathbf{V}_s^H\mathbf{S}_x^{-1}
> = \left[\mathbf{I}_D + \mathbf{S}_f\mathbf{V}_s^H\mathbf{S}_n^{-1}\mathbf{V}_s\right]^{-1}\mathbf{S}_f\mathbf{V}_s^H\mathbf{S}_n^{-1},
> $$
>
> 与单信号情形完全一样：**矩阵 MVDR + 矩阵标量增益**。这里标量增益换成了 $D\times D$ 矩阵，对角元素处理各信号自身的信噪比，非对角元素处理信号间的相互影响。

---

## 6.5 失配的 MVDR 与 MPDR（Mismatched Beamformers）

**问题的严重性。** 第 6.1.4 节提到 MPDR 的致命弱点：当模型导向矢量 $\mathbf{v}_m$ 与真实信号导向矢量 $\mathbf{v}_a$ 不一致时，MPDR 会把信号当成干扰**彻底抑制**。本节定量分析失配的影响，并给出最实用的稳健化手段。

### 6.5.1 DOA 失配

设真实信号方向为 $\mathbf{v}_a$，模型方向为 $\mathbf{v}_m$（两者夹角即 DOA 失配）。

> **定理 6.11**（MVDR 的失配损失）：MVDR 的失配损失等于其波束方向图在真实信号方向的**功率值**：
>
> $$
> \frac{A_{mvdr}(\mathbf{v}_a,\mathbf{v}_m)}{A_o(\mathbf{v}_a)} = \left|B_{mvdr}(\mathbf{v}_a,\mathbf{v}_m)\right|^2.
> $$
>
> 只要 $\mathbf{v}_m$ 还在主瓣内，损失就不大——**MVDR 对 DOA 失配相对稳健**。

> **定理 6.12**（MPDR 的失配损失）：MPDR 的失配损失为
>
> $$
> \frac{A_{mpdr}(\mathbf{v}_a,\mathbf{v}_m)}{A_o(\mathbf{v}_a)}
> = \frac{1}{1 + (2M + M^2)\sin^2(\mathbf{v}_m,\mathbf{v}_a;\mathbf{S}_n^{-1})},
> $$
>
> 其中 $M = \mathbf{v}_a^H\mathbf{S}_n^{-1}\mathbf{v}_a$ 是最优 SNR。**关键洞察：当 $M$ 很大（高 SNR）时，即使很小的失配也会导致巨大的损失**——MPDR 试图在 $\mathbf{v}_m$ 方向形成零点来"抑制信号"，结果把信号消掉了。高信噪比本来是好事，却让 MPDR 的失配问题雪上加霜。

### 6.5.2 阵列扰动

传感器位置误差、增益相位误差同样会导致导向矢量失配，效果类似于 DOA 失配——**MPDR 对阵列校准误差非常敏感**。实际阵列几乎不可能完美校准，这也是 MPDR 必须加稳健化处理的原因。

### 6.5.3 对角加载

> **定理 6.13**（对角加载波束形成器）：在 $\mathbf{S}_x$ 上加一个**对角矩阵** $\alpha\mathbf{I}$ 后再求逆：
>
> $$
> \mathbf{S}_x^{DL} = \mathbf{S}_x + \alpha\mathbf{I}, \qquad
> \mathbf{w}_{mpdr,dl} = \frac{[\mathbf{S}_x + \alpha\mathbf{I}]^{-1}\mathbf{v}_m}{\mathbf{v}_m^H[\mathbf{S}_x + \alpha\mathbf{I}]^{-1}\mathbf{v}_m}.
> $$

**为什么这有效？** 对角加载相当于**假设噪声电平更高**了。当噪声电平升高时：MPDR 不会把信号当成强干扰去抑制（信号相对噪声的"可抑制性"下降）；零陷变浅、变宽，对失配更稳健；但代价是干扰抑制能力下降。加载量 $\alpha$ 控制这个折中——这就是"用少量性能换取大量稳健性"的最典型例子。

![图 6.2：MPDR 失配下的 SINR 塌缩与对角加载恢复（N=10）。无加载时失配 δu=0.05 即塌缩约 34 dB；加载（LNR=10 dB）后显著恢复。](../pic/ch6_失配SINR.png)

> **例 6.1**（对角加载的经验规则）：加载量 $LNR = \alpha/\sigma_w^2$ 的经验取值为
>
> $$
> LNR \approx SNR + 10\text{ dB}, \qquad LNR \le INR.
> $$
>
> 加载太小不足以稳健，加载太大会牺牲干扰抑制能力。仿真中失配 $\delta u = 0.10$ 时，无加载 MPDR 输出 SINR 塌缩到 $-22$ dB，加载 $LNR = 10$ dB 后恢复到 $-2$ dB——稳健化立竿见影。

---

## 6.6 线性约束波束形成器（LCMV / LCMP）

**更多约束的动机。** MVDR 只有一个约束（无畸变）。当存在模型失配或主瓣内干扰时，单个点约束不足以保护主瓣，需要**更多约束**。

**典型约束。** 四类常用约束：

① **方向性约束**：在信号方向周围多个点强制值为 1，$\mathbf{w}^H\mathbf{v}(\mathbf{k}_i) = 1$（$i = 1,\ldots,M_c$）——把"一个点无畸变"放宽为"一片区域接近无畸变"；

② **导数约束**：强制波束方向图的导数为零，$\mathbf{w}^H\frac{\mathrm{d}\mathbf{v}(\mathbf{k})}{\mathrm{d}k} = 0$——使主瓣顶部**平坦**，对方向失配更稳健；

③ **零点约束**：在干扰方向强制为零，$\mathbf{w}^H\mathbf{v}(\mathbf{k}_j) = 0$——把"自动零陷"变成"强制零陷"（如已知干扰位置时）；

④ **特征矢量约束**：在某区域的主特征矢量方向上强制约束，实现"**宽主瓣保护**"。

> **定理 6.14**（LCMV / LCMP 最优解）：把上述约束统一写成 $\mathbf{C}^H\mathbf{w} = \mathbf{g}$（$\mathbf{C}$ 为约束矩阵，$\mathbf{g}$ 为约束响应），最优解为
>
> $$
> \mathbf{w}_{lcmv} = \mathbf{S}_n^{-1}\mathbf{C}\left[\mathbf{C}^H\mathbf{S}_n^{-1}\mathbf{C}\right]^{-1}\mathbf{g}, \qquad
> \mathbf{w}_{lcmp} = \mathbf{S}_x^{-1}\mathbf{C}\left[\mathbf{C}^H\mathbf{S}_x^{-1}\mathbf{C}\right]^{-1}\mathbf{g}.
> $$
>
> LCMV 用 $\mathbf{S}_n$（稳健），LCMP 用 $\mathbf{S}_x$（无需无信号数据）。LCMP 同样存在失配问题，但通过**更多约束**和对角加载可以显著改善。

**广义旁瓣对消器（GSC）。** 这是最重要的实现结构，把约束空间和自由空间分开：

> **定理 6.15**（GSC 结构）：
>
> $$
> \mathbf{w} = \mathbf{w}_q - \mathbf{B}\mathbf{w}_a,
> $$
>
> 其中 $\mathbf{w}_q$ 为满足所有约束的**静态权值**，$\mathbf{B}$ 为**阻塞矩阵**（$N \times (N-M_c)$，与所有约束正交），$\mathbf{w}_a$ 为**自适应权值**。
>
> 结构：输入 $\mathbf{x}$ 经上支路 $\mathbf{w}_q$ 得 $y_q$（静态方向图、约束自动满足），经下支路 $\mathbf{B}$ 后由自适应滤波 $\mathbf{w}_a$ 得 $y_a$，输出 $y = y_q - y_a$。

**为什么这个结构如此优雅？** ① 上支路保证静态方向图（约束满足）；② 下支路只处理"多余"的自由度（阻塞矩阵把约束方向上的分量全部滤掉）；③ 自适应部分变成**无约束**的最小化问题，可以用 LMS、RLS 简单实现；④ 经典的**旁瓣对消器**（Howells–Applebaum）就是 GSC 的特例。GSC 把"带约束的最优化"转化成"无约束的自适应"，是理论与工程结合最巧妙的桥梁之一。

---

## 6.7 特征空间波束形成器（Eigenvector Beamformers）

**主分量（PC）波束形成器。**

> **定理 6.16**（主分量波束形成器）：把 $\mathbf{S}_x$ 特征分解，只用前 $D_s$ 个最大特征值对应的特征矢量构造子空间，然后把 $\mathbf{v}_m$ 投影到这个子空间：
>
> $$
> \mathbf{U}_s = [\boldsymbol{\phi}_1, \boldsymbol{\phi}_2, \ldots, \boldsymbol{\phi}_{D_s}], \qquad
> \mathbf{v}_{\text{proj}} = \mathbf{U}_s\mathbf{U}_s^H\mathbf{v}_m,
> $$
>
> $$
> \mathbf{w}_{es} = \frac{\mathbf{S}_x^{-1}\mathbf{v}_{\text{proj}}}{\mathbf{v}_{\text{proj}}^H\mathbf{S}_x^{-1}\mathbf{v}_{\text{proj}}}.
> $$

**为什么这有效？** 信号和强干扰都位于 $\mathbf{U}_s$（大特征值子空间）中；投影去掉噪声子空间的分量，相当于**去噪**；更重要的是，投影对导向矢量失配**天然稳健**——因为投影把 $\mathbf{v}_m$"拉"回信号子空间内，修正了方向误差。

**主模式抑制（DMR）波束形成器。**

> **定理 6.17**（DMR 波束形成器）：用 $D_m$ 个最大特征值的平均值代替小特征值，构造修正的谱矩阵：
>
> $$
> \tilde{\mathbf{S}}_x = \sum_{i=1}^{D_m}\lambda_i\boldsymbol{\phi}_i\boldsymbol{\phi}_i^H
> + \alpha\sum_{i=D_m+1}^{N}\boldsymbol{\phi}_i\boldsymbol{\phi}_i^H,
> \qquad \alpha = \frac{1}{N-D_m}\sum_{i=D_m+1}^{N}\lambda_i.
> $$
>
> **效果**：抑制了噪声子空间特征矢量的影响，波束形成器更稳健——它本质上是"用噪声特征值的均值做对角加载"，与第 6.5.3 节的对角加载思想一脉相承。

---

## 6.8 波束空间波束形成器（Beamspace Beamformers）

**动机。** 阵元数 $N$ 可能很大（如 100 个阵元），直接处理 $\mathbf{S}_x$（$100\times100$）计算量巨大。如果只用 $N_{bs}$ 个波束（如 7 个）覆盖感兴趣区域：

$$
\mathbf{x}_{bs} = \mathbf{B}_{bs}^H\mathbf{x},
$$

其中 $\mathbf{B}_{bs}$ 是 $N \times N_{bs}$ 的波束空间矩阵（通常用常规波束构成）。

> **定理 6.18**（波束空间 MPDR）：
>
> $$
> \mathbf{w}_{bs} = \frac{\mathbf{S}_{x,bs}^{-1}\mathbf{v}_{bs}}{\mathbf{v}_{bs}^H\mathbf{S}_{x,bs}^{-1}\mathbf{v}_{bs}},
> \qquad \mathbf{S}_{x,bs} = \mathbf{B}_{bs}^H\mathbf{S}_x\mathbf{B}_{bs},\ \ \mathbf{v}_{bs} = \mathbf{B}_{bs}^H\mathbf{v}_m.
> $$
>
> **优点**：① 计算量从 $O(N^3)$ 降到 $O(N_{bs}^3)$；② 对波束区域外的干扰天然抑制；③ 第 7 章会看到自适应收敛更快（自由度更少）。

---

## 6.9 二次型约束波束形成器（Quadratically Constrained）

**问题设定。** 在满足无畸变约束 $\mathbf{w}^H\mathbf{v}_m = 1$ 的条件下，**同时**约束权值的模：

$$
\|\mathbf{w}\|^2 \le T_0.
$$

**为什么这个约束合理？** $\|\mathbf{w}\|^2$ 正是敏感度函数（第 2.12 节）。约束 $\|\mathbf{w}\|^2$ 相当于约束：白噪声增益 $A_w = 1/\|\mathbf{w}\|^2 \ge 1/T_0$；对阵列扰动的敏感度 $T_{se} = \|\mathbf{w}\|^2 \le T_0$。所以二次型约束直接限制了波束形成器的"放大器噪声"和扰动敏感性。

> **定理 6.19**（二次型约束的最优解）：用 Lagrange 乘子法，
>
> $$
> \mathbf{w}_{qc} = \frac{[\mathbf{S}_x + \beta\mathbf{I}]^{-1}\mathbf{v}_m}{\mathbf{v}_m^H[\mathbf{S}_x + \beta\mathbf{I}]^{-1}\mathbf{v}_m},
> $$
>
> 其中 $\beta$ 由约束 $\|\mathbf{w}\|^2 = T_0$ 决定。**关键结果：二次型约束的自然解就是对角加载**！与固定对角加载（经验性选择 $\alpha$）不同，二次型约束给出了给定 $T_0$ 下的**最优** $\beta$——这是对角加载的理论基础。

---

## 6.10 软约束波束形成器（Soft-Constraint Beamformers）

**核心思想。** 不强制方向图在某点等于某个值（硬约束），而是要求方向图在某个区域内**接近**某个期望形状（软约束）。定义在区域 $\Omega$ 上的二乘误差：

$$
\epsilon^2 = \int_\Omega \left|B(\psi) - B_d(\psi)\right|^2\,\mathrm{d}\psi
= (\mathbf{w} - \mathbf{w}_d)^H\mathbf{Q}(\mathbf{w} - \mathbf{w}_d),
\qquad \mathbf{Q} = \int_\Omega \mathbf{v}(\psi)\mathbf{v}^H(\psi)\,\mathrm{d}\psi,
$$

其中 $\mathbf{w}_d$ 是产生期望方向图 $B_d(\psi)$ 的权值。在约束 $\epsilon^2 \le \epsilon_0^2$ 下最小化输出功率。

> **定理 6.20**（软约束的最优解）：
>
> $$
> \mathbf{w} = [\mathbf{S}_x + \beta\mathbf{Q}]^{-1}\mathbf{S}_x\mathbf{w}_d.
> $$
>
> **广义对角加载**：对角加载是 $\mathbf{Q} = \mathbf{I}$ 的特例；软约束允许在不同区域用不同权重的 $\mathbf{Q}$（例如主瓣区域权重高、旁瓣区域权重低），比单一对角加载灵活得多。

---

## 6.11 相关信号与空间平滑（Correlated Signals and Spatial Smoothing）

**问题的本质。** 当信号和干扰**相干**（$|\rho| = 1$）或强相关时，$\mathbf{S}_x$ 的**信号子空间维数小于信号个数**（第 5.4 节已证明）。此时 MPDR 试图在干扰方向形成零点，但**同时把相干的信号分量也消掉了**——因为相干信号与干扰在统计上无法区分。这是子空间类算法（MUSIC 等）和最优波束形成共同的痛点。

**空间平滑。**

> **定理 6.21**（空间平滑去相干）：把 $N$ 元阵列分成 $L$ 个重叠的子阵，每个子阵 $M$ 个阵元（$M > D$），对每个子阵的协方差矩阵求平均：
>
> $$
> \mathbf{S}_{ss} = \frac{1}{L}\sum_{i=1}^{L}\mathbf{S}_x^{(i)},
> $$
>
> 前后向空间平滑（FBSS）：
>
> $$
> \mathbf{S}_{fbss} = \frac{1}{2L}\sum_{i=1}^{L}\left[\mathbf{S}_x^{(i)} + \mathbf{J}\left(\mathbf{S}_x^{(i)}\right)^*\mathbf{J}\right],
> $$
>
> 其中 $\mathbf{J}$ 是交换矩阵（前后向平均可看成"镜像子阵"的平均）。

**为什么这有效？** 对于两个相干信号（$S_{12} = \sqrt{P_1P_2}e^{j\phi}$），子阵平移改变了它们的**相对相位**。对多个子阵平均后，相干信号之间的相位差被"平均掉"，相关性降低——信号协方差矩阵重新满秩。**条件**：需要 $L \ge D/2$ 个子阵才能完全去相干。

> **例 6.2**（FBSS 数值验证）：$N = 10$，两个相干信号。全阵 $\mathbf{S}_x$ 特征值为 $\{219.6,\, 1.0,\, 1.0,\, \ldots\}$——信号子空间秩为 1（相干）；FBSS（$M = 8$ 元子阵，$L = 3$）后特征值为 $\{108.8,\, 56.7,\, 1.0,\, \ldots\}$——**子空间秩恢复为 2**，子空间类算法（MUSIC 等）重新可用。代价是有效孔径缩短（子阵比全阵小），这正是"以孔径换稳健"。

---

## 6.12 宽带波束形成器（Broadband Beamformers）

**宽带 vs 窄带。** 窄带假设 $B_s\cdot\Delta T_{\max} \ll 1$（第 2.6 节）要求信号穿过阵列孔径的时间内复包络基本不变。当带宽较宽或阵列较大时，窄带近似失效，时延不能再简化为相移，需要宽带处理。两类经典方法：

**DFT 波束形成器（频域方法）。** 把宽带信号分成 $M$ 个频率仓，每个频率仓独立做窄带波束形成，再加权合成：① 对每个传感器的输出做 FFT，得到 $M$ 个频率仓；② 在每个频率仓 $\omega_m$ 计算窄带 MVDR/MPDR 权值 $\mathbf{w}(\omega_m)$；③ 每个频率仓的输出为 $Y(\omega_m) = \mathbf{w}^H(\omega_m)\mathbf{X}(\omega_m)$；④ 做 IFFT 得到时域输出。频域方法的依据正是第 5.1 节的频域快拍模型——各频率仓近似统计独立，可并行处理。

**FIR 波束形成器（时域方法）。** 每个传感器后面接一个 **FIR 滤波器**（长度 $L$）：

$$
y(k) = \sum_{m=0}^{L-1}\sum_{n=0}^{N-1} w_{n,m}\, x_n(k-m),
$$

把 $N\times L$ 个权值排成一个 $NL\times 1$ 矢量，定义 $NL\times 1$ 的"延迟堆积"数据矢量 $\tilde{\mathbf{x}}(k)$，**所有窄带结果直接适用**——因为"阵元 + 延迟"的扩展阵列在数学上与普通阵列同构。GSC 的宽带版本：上支路是静态 FIR 滤波器，下支路是阻塞矩阵 + 自适应 FIR 滤波器。

---

## 6.13 本章总结

**从基础到高级的完整路径。**

```
基础层（§6.1）：
├── MVDR：S_n^{-1}v / (v^H S_n^{-1} v) ← 最核心的公式
├── MMSE：MVDR + 标量增益
└── MPDR：用 S_x 代替 S_n（危险！对失配敏感）

干扰层（§6.2-6.4）：
├── 离散干扰：方向图 = 常规波束 - 干扰波束的倍数
├── 空域扩展干扰：ARMA 建模 + 空间白化
└── 多信号：矩阵 MVDR

稳健层（§6.5-6.6）：
├── 对角加载：S_x + αI（最实用的稳健化技术）
├── 线性约束：LCMV/LCMP（主瓣保护）
└── GSC 结构：w = w_q - B w_a（约束与自适应分离）

降维层（§6.7-6.8）：
├── 特征空间：投影到信号子空间
├── DMR：用平均噪声特征值修正
└── 波束空间：B^H x（降维处理）

扩展层（§6.9-6.12）：
├── 二次型约束：对角加载的最优版本
├── 软约束：广义对角加载
├── 空间平滑：处理相干信号
└── 宽带：DFT / FIR 波束形成器
```

**三种核心波束形成器。**

**表 6.3** 三种核心波束形成器对比

| 波束形成器 | 公式 | 何时使用 | 风险 |
| --- | --- | --- | --- |
| MVDR | $\mathbf{S}_n^{-1}\mathbf{v}_s$ | 知道噪声统计 | 需要无信号数据估计 $\mathbf{S}_n$ |
| MPDR | $\mathbf{S}_x^{-1}\mathbf{v}_m$ | 只知道总统计 | 信号失配时性能崩溃 |
| MPDR + DL | $[\mathbf{S}_x+\alpha\mathbf{I}]^{-1}\mathbf{v}_m$ | 不确定 / 有失配 | 加载量需经验选择 |

**贯穿本章的核心思想。**

1. **MVDR 是所有最优波束形成器的基础**——MMSE、最大 SNR 在矩阵操作上都回到 MVDR，区别仅在后端的标量处理；理解 $w = \mathbf{S}_n^{-1}\mathbf{v}_s$ 就抓住了本章骨架。

2. **MPDR 用 $\mathbf{S}_x$ 代替 $\mathbf{S}_n$ 是"必要但危险"的折中**——它使波束形成器可以在没有无信号数据的情况下工作，但对失配非常敏感；高信噪比下失配损失反而更大。

3. **对角加载是实际系统的基本配置**——它能同时应对 DOA 失配、阵列扰动和有限样本效应；经验规则 $LNR \approx SNR + 10$ dB；二次型约束（第 6.9 节）给出了它的最优形式。

4. **GSC 结构是"分离的艺术"**——把约束（静态）和自适应（自由）分开，使设计和分析都变得简单；这个结构在第 7 章的自适应实现中会大放异彩。

5. **稳健性永远比最优性更重要**——一个在理想条件下最优、在实际条件下崩溃的波束形成器没有用；第 6.5–6.10 节的所有技术本质上都是在**用少量性能换取大量稳健性**。

6. **空间平滑是"以孔径换稳健"**——通过牺牲有效孔径（子阵长度变短）来获得对相干信号的处理能力；这是阵列处理中"没有免费午餐"的典型例子。
