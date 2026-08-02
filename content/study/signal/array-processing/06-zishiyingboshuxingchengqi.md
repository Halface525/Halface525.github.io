---
data: 2026-08-03
tags:
  - 阵列处理
  - 信号处理
  - 自适应波束形成
lastdate: 2026-08-03
auther: Halface
---
第 6 章的所有波束形成器都假设**统计量已知**：MVDR 需要噪声谱矩阵 $\mathbf{S}_n$，MMSE 需要 $\mathbf{S}_n$ 与 $\mathbf{S}_f$，MPDR 需要总谱矩阵 $\mathbf{S}_x$。但实际系统中这些统计量是**未知的**——我们只能观测到有限的数据快拍 $\mathbf{x}(1), \mathbf{x}(2), \ldots, \mathbf{x}(K)$。本章的核心任务正是：**从数据中估计统计量，然后（或同时）计算权值**。

```
第 6 章：统计量已知 → 直接计算最优权值（闭式解）
   ↓
第 7 章：统计量未知 → 从数据估计 → 计算权值（自适应）
```

自适应算法按数据处理方式分为三大类，其核心权衡是**计算复杂度 vs 收敛速度 vs 稳态精度**：

**表 7.2** 三大类自适应算法

| 算法类型 | 代表算法 | 计算复杂度 | 收敛速度 | 适用场景 |
| --- | --- | --- | --- | --- |
| 块处理 | SMI（采样矩阵求逆） | $O(N^3)$ | 快（约 $2N$ 个快拍） | 稳定环境 |
| 递推 | RLS（递推最小二乘） | $O(N^2)$ | 快 | 时变环境 |
| 随机梯度 | LMS（最小均方） | $O(N)$ | 慢 | 实时处理 |

对应原书第 7 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 7.1** 本章符号表（Notation）

| 符号 | 含义与说明 |
| --- | --- |
| **数据与统计量 / Data and Statistics** | |
| $K$ | 快拍个数（number of snapshots） |
| $N$ | 阵元数；$D$ 信号源个数 |
| $\mathbf{x}(k)$ | 第 $k$ 个快拍矢量 |
| $\mathbf{X}$ | 数据矩阵，$\mathbf{X} = [\mathbf{x}(1),\ldots,\mathbf{x}(K)]$，$N \times K$ |
| $\mathbf{S}_x, \mathbf{S}_n$ | 真实总 / 噪声谱矩阵 |
| $\hat{\mathbf{S}}_x, \hat{\mathbf{S}}_n$ | 采样谱矩阵（估计值） |
| $\mathbf{v}_s, \mathbf{v}_m$ | 真实 / 模型导向矢量 |
| $\mathbf{J}$ | 交换矩阵（exchange matrix） |
| $\mathbf{U}, \mathbf{\Sigma}, \mathbf{V}$ | SVD 因子 |
| **SMI / RLS** | |
| $\mathbf{w}_{smi}, \mathbf{w}_{rls}$ | SMI / RLS 权值 |
| $\rho$（或 $p$） | 归一化 SINR，$\rho = SINR_{smi}/SINR_{opt}$ |
| $\mu$ | RLS 遗忘因子（$0<\mu\le1$）或 LMS 步长 |
| $\mathbf{P}(K)$ | RLS 逆矩阵 $\hat{\mathbf{S}}_x^{-1}(K)$ |
| $\mathbf{g}(K)$ | RLS 增益矢量 |
| $\mathbf{z}(K), e(k)$ | 阻塞矩阵输出 / 误差信号 |
| $\mathbf{Q}$ | 共轭对称酉变换 |
| $\mathbf{R}(K)$ | QRD 上三角因子（平方根） |
| $c, s$ | Givens 旋转余弦 / 正弦 |
| **梯度 / LMS** | |
| $J(\mathbf{w})$ | 代价函数；$\mathbf{p}$ 互相关向量 |
| $\lambda_i, \lambda_{\max}$ | 特征值及其最大值 |
| $\tau_i$ | 时间常数 |
| $\mathcal{M}$ | 稳态失调量（misadjustment） |
| **检测 / Detection** | |
| $AIC(d), MDL(d)$ | 信息准则代价（$d$ 为假设信号数） |
| $L(d)$ | 假设 $d$ 个信号时的对数似然 |
| $N_{bs}$ | 波束空间维数；$\mathbf{B}_{bs}$ 波束空间矩阵 |
| $L$（宽带） | FIR 滤波器长度 |
| $\tilde{\mathbf{x}}(k)$ | 延迟堆积数据矢量（$NL \times 1$） |
| $\mathbf{v}_{\text{tapped}}$ | 延迟导向矢量 |

---

## 7.1 空域谱矩阵的估计（Estimation of Spatial Spectral Matrices）

**采样谱矩阵。** 给定 $K$ 个独立同分布快拍 $\mathbf{x}(1), \ldots, \mathbf{x}(K)$，$\mathbf{S}_x$ 的最大似然估计（不施加任何结构约束时）就是**采样协方差矩阵**：

> **定义 7.1**（采样协方差矩阵 / Sample Covariance Matrix）：
>
> $$
> \hat{\mathbf{S}}_x = \frac{1}{K}\sum_{k=1}^{K}\mathbf{x}(k)\mathbf{x}^H(k) = \frac{1}{K}\mathbf{X}\mathbf{X}^H,
> $$
>
> 其中 $\mathbf{X} = [\mathbf{x}(1),\ldots,\mathbf{x}(K)]$ 为 $N \times K$ 数据矩阵。

> **定理 7.1**（采样协方差 = 最大似然估计）：对复 Gauss 快拍，联合概率密度为
>
> $$
> p(\mathbf{x}(1),\ldots,\mathbf{x}(K);\mathbf{S}_x) = \frac{1}{\pi^{NK}\det(\mathbf{S}_x)^K}\exp\!\left[-K\,\text{tr}(\mathbf{S}_x^{-1}\hat{\mathbf{S}}_x)\right],
> $$
>
> 最大化似然等价于最小化 $\ln\det(\mathbf{S}_x) + \text{tr}(\mathbf{S}_x^{-1}\hat{\mathbf{S}}_x)$，对 $\mathbf{S}_x^{-1}$ 求导并令为零得 $\hat{\mathbf{S}}_x = \mathbf{S}_x$——即无约束 MLE 正是采样协方差矩阵。

**什么时候需要 $K > N$？** 若 $K < N$，$\hat{\mathbf{S}}_x$ 是**奇异的**（秩至多为 $K$），无法求逆。这就是对角加载在自适应中如此普遍的原因——它保证 $\hat{\mathbf{S}}_x + \alpha\mathbf{I}$ 总是可逆。

**采样谱矩阵的统计特性（Wishart 分布）。** $\hat{\mathbf{S}}_x$ 服从**复 Wishart 分布**。对 $K \ge N$：

> **定理 7.2**（Wishart 分布与特征值渐近）：复 Wishart 概率密度为
>
> $$
> p(\hat{\mathbf{S}}_x) \propto \det(\hat{\mathbf{S}}_x)^{K-N}\exp\!\left[-K\,\text{tr}(\mathbf{S}_x^{-1}\hat{\mathbf{S}}_x)\right].
> $$
>
> $K$ 很大时特征值的渐近分布：
> - 信号特征值 $\hat{\lambda}_i \sim \mathcal{N}(\lambda_i,\, \lambda_i^2/K)$，$i = 1,\ldots,D$；
> - 噪声特征值 $\hat{\lambda}_i \sim \mathcal{N}(\sigma_w^2,\, \sigma_w^4/K)$，$i = D+1,\ldots,N$；
> - 特征矢量 $\hat{\boldsymbol{\phi}}_i$ 与真实 $\boldsymbol{\phi}_i$ 的夹角与 $1/\sqrt{K}$ 成正比。
>
> 这些统计特性决定了自适应波束形成器的**收敛速度**、检测算法（AIC/MDL）的**性能**，也解释了为什么需要对角加载来抑制噪声特征矢量的影响。

**前后向（FB）平均。** 对**共轭对称阵列**（如标准线阵），阵列流形满足 $\mathbf{v}(\psi) = \mathbf{J}\mathbf{v}^*(\psi)$，因此 $\mathbf{S}_x$ 是**中心 Hermitian**（persymmetric）矩阵：$\mathbf{S}_x = \mathbf{J}\mathbf{S}_x^*\mathbf{J}$。

> **定义 7.2**（前后向平均 / Forward-Backward Averaging）：
>
> $$
> \hat{\mathbf{S}}_{x,fb} = \frac{1}{2}\left[\hat{\mathbf{S}}_x + \mathbf{J}\hat{\mathbf{S}}_x^*\mathbf{J}\right],
> $$
>
> 等价于把前向快拍与其共轭镜像一起平均（等效快拍数翻倍）。

**为什么 FB 平均好？** ① 利用了阵列对称性的先验知识；② 估计误差减少约一半（等效快拍数翻倍）；③ 经酉变换 $\mathbf{Q}$ 后协方差矩阵为**实**的，可用实数运算，计算量减少约 75%。

**奇异值分解（SVD）。** SVD 是计算 $\hat{\mathbf{S}}_x$ 特征分解的**数值稳定**方法。对数据矩阵 $\mathbf{X}$（$N \times K$）做 SVD：

$$
\mathbf{X} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^H,
\qquad \hat{\mathbf{S}}_x = \frac{1}{K}\mathbf{U}\mathbf{\Sigma}^2\mathbf{U}^H.
$$

**为什么 SVD 比直接特征分解好？** ① 数值稳定性更高（避免先算 $\mathbf{X}\mathbf{X}^H$ 带来的平方精度损失）；② 动态范围更小（$\mathbf{\Sigma}$ 的元素是特征值的平方根）；③ 可直接得到信号子空间与噪声子空间。

---

## 7.2 采样矩阵求逆（Sample Matrix Inversion, SMI）

**核心思想。** 把 $\hat{\mathbf{S}}_x$ 直接代入第 6 章的 MPDR 公式：

> **定理 7.3**（SMI 波束形成器）：
>
> $$
> \mathbf{w}_{smi} = \frac{\hat{\mathbf{S}}_x^{-1}\mathbf{v}_m}{\mathbf{v}_m^H\hat{\mathbf{S}}_x^{-1}\mathbf{v}_m}.
> $$
>
> 若可估计 $\mathbf{S}_n$（无信号时的数据），亦可做 MVDR 的 SMI 版本 $\mathbf{w}_{mvdr,smi} = \hat{\mathbf{S}}_n^{-1}\mathbf{v}_s/(\mathbf{v}_s^H\hat{\mathbf{S}}_n^{-1}\mathbf{v}_s)$。

SMI 是"块处理"：收集 $K$ 个快拍，估计协方差，一次性算出权值。它概念最简单——**就是第 6 章公式里把统计量换成估计值**。

**性能分析——Reed–Mallett–Brennan 结果。** 这是自适应波束形成理论最经典的结论之一。定义实际输出 SINR 与最优 SINR 之比 $\rho = SINR_{smi}/SINR_{opt}$：

> **定理 7.4**（RMB 结果）：Reed、Mallett 与 Brennan（1974）证明 $\rho$ 的分布**与环境及信号参数无关**，只取决于 $N$ 和 $K$：
>
> $$
> p(\rho) = \frac{K!}{(N-2)!(K+1-N)!}\,(1-\rho)^{N-2}\,\rho^{K+1-N}, \qquad 0 \le \rho \le 1,
> $$
>
> 即 $\rho \sim \text{Beta}(K+2-N,\, N-1)$。均值为
>
> $$
> \boxed{E[\rho] = \frac{K+2-N}{K+1}}.
> $$
>
> **关键数值（"2N 规则"）**：平均损失 3 dB（$\rho = 0.5$）需 $K \approx 2N$（精确解 $K = 2N-3$）；0.5 dB（$\rho \approx 0.9$）需 $K \approx 10N$；0.1 dB（$\rho \approx 0.98$）需 $K \approx 50N$。
>
> **重要前提**：RMB 结果适用于**不含信号的训练快拍**（干扰 + 噪声，即 MVDR 训练）。若用含信号的 $\hat{\mathbf{S}}_x$（MPDR），信号会**污染**协方差估计导致"自消"，损失与信号功率有关、远大于 RMB 预测（数值验证见下）。

> **例 7.1**（RMB 数值验证）：$N = 10$，仿真蒙特卡洛 400 次。**无信号训练**：$K = 20$ 时 $E[\rho] = 0.574$（理论 0.571）、$K = 50$ 时 0.826（理论 0.824）——完全吻合；**含信号训练（MPDR）**：$K = 50$ 时 $E[\rho]$ 仅约 0.05，信号被严重自消。这正是工程上强调"用无信号数据训练 SMI"的原因。

![图 7.1：SMI 平均 SINR 损失 vs K/N（N=10）。无信号训练（圆点）与 RMB 理论（蓝线）完全吻合；含信号训练（方块）远差——MPDR 自消问题。K/N=2 处 3dB 损失线即"2N 规则"。](../pic/ch7_RMB性能.png)

**对角加载——SMI 的稳健化。**

> **定理 7.5**（SMI 对角加载）：
>
> $$
> \hat{\mathbf{S}}_x^{DL} = \hat{\mathbf{S}}_x + \alpha\mathbf{I}, \qquad
> \mathbf{w}_{smi,dl} = \frac{[\hat{\mathbf{S}}_x + \alpha\mathbf{I}]^{-1}\mathbf{v}_m}{\mathbf{v}_m^H[\hat{\mathbf{S}}_x + \alpha\mathbf{I}]^{-1}\mathbf{v}_m}.
> $$
>
> 经验规则 $LNR = 10\log_{10}(\alpha/\sigma_w^2) \approx SNR + 10$ dB。

**为什么对角加载在自适应中如此重要？** 有两个原因：**（1）对抗噪声特征值扩展**——$K$ 有限时噪声特征值围绕 $\sigma_w^2$ 散布，噪声特征矢量会**污染**波束方向图、产生随机高旁瓣；加载把所有噪声特征值都加上 $\alpha$，**压制噪声特征矢量的影响**。**（2）允许 $K < N$ 时工作**——$K < N$ 时 $\hat{\mathbf{S}}_x$ 奇异无法求逆，加载后矩阵正定、可逆。

**SMI 总结。** 优点：概念简单、收敛快（约 $2N$ 快拍达 3 dB 内）、平稳环境下性能接近最优。缺点：计算量大（$O(N^3)$ 求逆）；块处理不适合实时更新；需经验选择加载量。

---

## 7.3 递推最小二乘（RLS）

**从 SMI 到 RLS。** SMI 是块处理——收集 $K$ 个快拍、算一次权值。环境变化时需重新收集数据。RLS 是**递推处理**——每收到一个新快拍就更新一次权值，适合时变环境。

**指数加权最小二乘。** 核心思想：不用等权平均，而用**指数衰减权**：

> **定义 7.3**（指数遗忘加权 / Exponential Weighting）：
>
> $$
> \hat{\mathbf{S}}_x(K) = \sum_{k=1}^{K}\mu^{K-k}\mathbf{x}(k)\mathbf{x}^H(k),
> $$
>
> 其中 $0 < \mu \le 1$ 是**遗忘因子**。$\mu$ 越小旧数据遗忘越快（跟踪能力越强但方差越大）；$\mu = 1$ 时退化为普通最小二乘（与 SMI 等价）。

**矩阵求逆引理——RLS 的核心技巧。** 定义 $\mathbf{P}(K) = \hat{\mathbf{S}}_x^{-1}(K)$。协方差的递推关系为

$$
\hat{\mathbf{S}}_x(K) = \mu\hat{\mathbf{S}}_x(K-1) + \mathbf{x}(K)\mathbf{x}^H(K),
$$

> **定理 7.6**（RLS 递推）：利用 Woodbury 恒等式，
>
> $$
> \mathbf{P}(K) = \mu^{-1}\mathbf{P}(K-1) - \mu^{-1}\mathbf{g}(K)\mathbf{x}^H(K)\mathbf{P}(K-1),
> $$
>
> 其中**增益矢量**
>
> $$
> \mathbf{g}(K) = \frac{\mu^{-1}\mathbf{P}(K-1)\mathbf{x}(K)}{1 + \mu^{-1}\mathbf{x}^H(K)\mathbf{P}(K-1)\mathbf{x}(K)} = \mathbf{P}(K)\mathbf{x}(K).
> $$
>
> 关键：每步只做 $O(N^2)$ 次运算，避免了每步重新求逆的 $O(N^3)$。

**MPDR 的 RLS 实现。** 权值由 $\mathbf{w}_{mpdr}(K) = \mathbf{P}(K)\mathbf{v}_m/(\mathbf{v}_m^H\mathbf{P}(K)\mathbf{v}_m)$ 给出，每步递推更新 $\mathbf{P}$ 再计算权值。**GSC 的 RLS 实现**：在第 6 章的 GSC 结构 $\mathbf{w} = \mathbf{w}_q - \mathbf{B}\mathbf{w}_a$ 中，RLS 只更新下支路自适应部分：

$$
\mathbf{w}_a(K) = \mathbf{w}_a(K-1) + \mathbf{P}_z(K)\mathbf{z}(K)e^*(K),
$$

其中 $\mathbf{z}(K) = \mathbf{B}^H\mathbf{x}(K)$ 是阻塞矩阵输出，$e(K)$ 是误差信号。优点：更新维数从 $N$ 降到 $N-M_c$；上支路静态权值 $\mathbf{w}_q$ 固定；结构清晰易调试。

**共轭对称 RLS。** 利用阵列共轭对称性，把数据变换到实域：

$$
\mathbf{X}_{fb} = \mathbf{Q}^H[\mathbf{X},\, \mathbf{J}\mathbf{X}^*],
$$

其中 $\mathbf{Q}$ 是酉变换矩阵。好处：运算量减少约 75%、数值稳定性更好、内存需求减半。

---

## 7.4 高效递推实现（QR 分解 / QRD）

**为什么要用 QR 分解？** RLS 在数值上存在隐患：$\mathbf{P}(K)$ 可能**失去正定性**，导致数值不稳定。QRD 直接处理**数据矩阵**而非协方差矩阵，显著改善数值稳定性。

**基本思想。**

> **定理 7.7**（QRD 平方根分解）：对指数加权数据矩阵做 QR 分解，
>
> $$
> \mathbf{A}_\mu(K) = \mathbf{Q}(K)\begin{bmatrix} \mathbf{R}(K) \\ \mathbf{0} \end{bmatrix},
> $$
>
> 其中 $\mathbf{R}(K)$ 是 $N\times N$ 上三角矩阵（Cholesky 因子）。关键关系：
>
> $$
> \hat{\mathbf{S}}_x(K) = \mathbf{A}_\mu^H(K)\mathbf{A}_\mu(K) = \mathbf{R}^H(K)\mathbf{R}(K),
> $$
>
> 即 $\mathbf{R}$ 就是 $\hat{\mathbf{S}}_x$ 的**平方根**因子——条件数从 $\kappa(\hat{\mathbf{S}}_x)$ 降到 $\sqrt{\kappa}$，数值稳定性大幅提升。

**Givens 旋转。** 实现 QRD 的实用工具。

> **定理 7.8**（Givens 旋转）：对 $\begin{bmatrix} a \\ b \end{bmatrix}$，Givens 旋转 $\mathbf{G}$ 使其化为 $\begin{bmatrix} \sqrt{|a|^2+|b|^2} \\ 0 \end{bmatrix}$：
>
> $$
> c = \frac{a}{\sqrt{|a|^2+|b|^2}},\ \ s = \frac{b}{\sqrt{|a|^2+|b|^2}},
> \qquad \mathbf{G} = \begin{bmatrix} c^* & s \\ -s^* & c \end{bmatrix}.
> $$
>
> 在 QRD 中：新快拍 $\mathbf{x}(K)$ 追加到 $\mathbf{R}(K-1)$ 下方，用一系列 Givens 旋转消去新行元素，得到更新后的 $\mathbf{R}(K)$，再回代求解。

**脉动阵列。** QRD 可用**脉动阵列**（systolic array）实现，每个处理单元只做简单 Givens 旋转：**边界单元**计算 $c$、$s$（需平方根），**内部单元**用 $c$、$s$ 更新数据。优点：高度并行、无需全局通信、适合 VLSI 实现。

---

## 7.5 梯度算法（Gradient Algorithms）

**为什么需要梯度方法？** SMI 和 RLS 都是**代数方法**——直接求解线性方程组。梯度方法用**迭代搜索**逼近最优解，计算简单、易于理解，但收敛速度取决于特征值分布。

**最速下降法——MMSE 波束形成器。** 第 6 章 MMSE 代价函数为

$$
J(\mathbf{w}) = E[|d - \mathbf{w}^H\mathbf{x}|^2] = \sigma_d^2 - \mathbf{w}^H\mathbf{p} - \mathbf{p}^H\mathbf{w} + \mathbf{w}^H\mathbf{S}_x\mathbf{w},
$$

梯度 $\nabla J(\mathbf{w}) = -2\mathbf{p} + 2\mathbf{S}_x\mathbf{w}$。

> **定理 7.9**（最速下降迭代与收敛）：最速下降迭代
>
> $$
> \mathbf{w}(k+1) = \mathbf{w}(k) - \mu\nabla J(\mathbf{w}(k)) = \mathbf{w}(k) + \mu[\mathbf{p} - \mathbf{S}_x\mathbf{w}(k)].
> $$
>
> 定义权值误差 $\tilde{\mathbf{w}}(k) = \mathbf{w}(k) - \mathbf{w}_{opt}$，则 $\tilde{\mathbf{w}}(k+1) = (\mathbf{I} - \mu\mathbf{S}_x)\tilde{\mathbf{w}}(k)$。在特征空间中各分量独立演化 $v_i(k+1) = (1-\mu\lambda_i)v_i(k)$。**收敛条件** $0 < \mu < 2/\lambda_{\max}$；**时间常数** $\tau_i \approx 1/(\mu\lambda_i)$。
>
> **关键问题**：$\lambda_{\max}/\lambda_{\min}$ 很大时收敛很慢——这就是**特征值扩散问题**，是梯度方法的固有弱点。

---

## 7.6 LMS 算法（Least Mean Squares）

**从确定性梯度到随机梯度。** 最速下降需要真实的 $\mathbf{S}_x$ 和 $\mathbf{p}$。自适应环境中只能用**瞬时估计**：

$$
\hat{\mathbf{S}}_x(k) = \mathbf{x}(k)\mathbf{x}^H(k), \qquad \hat{\mathbf{p}}(k) = \mathbf{x}(k)d^*(k),
$$

代入最速下降公式：

> **定义 7.4**（LMS 算法）：误差 $e(k) = d(k) - \mathbf{w}^H(k)\mathbf{x}(k)$，
>
> $$
> \mathbf{w}(k+1) = \mathbf{w}(k) + \mu\mathbf{x}(k)e^*(k),
> $$
>
> 即著名的 **Widrow–Hoff LMS 算法**。

**LMS 为什么重要？** 优点：计算量极小（$O(N)$ 次乘加）；无需矩阵求逆；无需存储历史数据；可跟踪缓慢时变环境。缺点：收敛慢（取决于特征值扩展）；稳态误差不为零（有"失调"）；对步长 $\mu$ 敏感。

**LMS 的收敛特性。**

> **定理 7.10**（LMS 均值收敛）：$E[\mathbf{w}(k)] \to \mathbf{w}_{opt}$ 当且仅当 $0 < \mu < 2/\lambda_{\max}$——均值收敛条件与最速下降相同。

> **定理 7.11**（LMS 稳态失调）：均方收敛时稳态失调
>
> $$
> \mathcal{M} \approx \frac{\mu}{2}\sum_{i=1}^{N}\lambda_i = \frac{\mu}{2}\,\text{tr}(\mathbf{S}_x),
> $$
>
> 失调与 $\mu$ 和输入功率成正比。**LMS 的核心权衡**：$\mu$ 大则收敛快但失调大，$\mu$ 小则相反。归一化 LMS（NLMS）用 $\mu(k) = \beta/(\mathbf{x}^H(k)\mathbf{x}(k)+\delta)$（$0<\beta<2$）使算法对信号功率变化更鲁棒。

![图 7.2：LMS 学习曲线——特征值扩散 κ=50 时收敛明显慢于 κ=2。失调量与 μ·tr(Sx) 成正比。](../pic/ch7_LMS收敛.png)

**LMS 的各种变体。**

**表 7.3** LMS 算法的典型变体

| 算法 | 特点 | 更新式 |
| --- | --- | --- |
| Widrow LMS | 需要期望信号 $d(k)$ | $\mathbf{w}(k+1)=\mathbf{w}(k)+\mu\mathbf{x}(k)e^*(k)$ |
| Griffiths LMS | 不需要 $d(k)$，用导向矢量 | $\mathbf{w}(k+1)=\mathbf{w}(k)+\mu[\mathbf{v}_s-\mathbf{x}(k)y^*(k)]$ |
| Frost LMS | 带线性约束 | $\mathbf{w}(k+1)=\mathbf{P}[\mathbf{w}(k)-\mu\mathbf{x}(k)y^*(k)]+\mathbf{w}_q$ |
| GSC-LMS | 约束 + 自适应分离 | $\mathbf{w}_a(k+1)=\mathbf{w}_a(k)+\mu\mathbf{z}(k)e^*(k)$ |

**SMI / RLS / LMS 对比**见第 7.11 节总结表。

---

## 7.7 信号子空间检测（Detection of Signal Subspace Dimension）

**为什么要检测信号个数？** 第 5 章特征分解中，信号子空间维数 $D$ 决定了：第 6.8 节特征空间波束形成器的子空间大小、第 8–9 章 DOA 估计的信号数目、干扰抑制需抑制多少个干扰。但实际中 $D$ 未知，需从数据判断。

**AIC（赤池信息准则）与 MDL（最小描述长度）。**

> **定义 7.5**（信息准则）：AIC 与 MDL 都在"拟合优度 + 参数惩罚"之间折中：
>
> $$
> AIC(d) = -2\ln L(d) + 2\cdot\text{自由度}(d), \qquad
> MDL(d) = -2\ln L(d) + \frac{1}{2}\cdot\text{自由度}(d)\cdot\ln K,
> $$
>
> 其中 $L(d)$ 是假设 $d$ 个信号时的最大似然。对阵列模型（$N$ 阵元、$K$ 快拍）：
>
> $$
> AIC(d) = K(N-d)\ln\!\left(\frac{\frac{1}{N-d}\sum_{i=d+1}^{N}\lambda_i}{(\prod_{i=d+1}^{N}\lambda_i)^{1/(N-d)}}\right) + d(2N-d),
> $$
>
> $$
> MDL(d) = K(N-d)\ln\!\left(\frac{\frac{1}{N-d}\sum_{i=d+1}^{N}\lambda_i}{(\prod_{i=d+1}^{N}\lambda_i)^{1/(N-d)}}\right) + \frac{1}{2}d(2N-d)\ln K.
> $$
>
> 第一项是噪声特征值的算术均值与几何均值之比（拟合优度：$d$ 越大拟合越好该项越小），第二项是惩罚项。

**直观理解与选择。** 选择使 AIC 或 MDL 最小的 $d$。**AIC 的问题**：渐近上不是一致的——即使 $K \to \infty$ 仍以正概率过估计。**MDL 的优点**：**一致估计**——$K \to \infty$ 时 $\hat{d} \to d$（概率为 1）。

> **例 7.2**（AIC / MDL 数值）：$N=8$、$K=100$、两个等功率信号，蒙特卡洛 300 次。各 SNR 下 MDL 正确率均为 1.00（一致估计）；AIC 过估计率约 6%–11%（低 SNR 时明显）。实践准则：**低 SNR 用 AIC（宁可过估计，让后续处理去滤除多余分量），高 SNR 用 MDL（一致）**。

**FB 平均下的 AIC/MDL。** 利用 FB 平均后自由度减半：

$$
AIC_{FB}(d) = L(d) + \frac{1}{2}d(2N-d+1), \qquad
MDL_{FB}(d) = L(d) + \frac{1}{4}d(2N-d+1)\ln K.
$$

---

## 7.8 特征空间与 DMR 波束形成器（Eigenspace and DMR Beamformers）

**特征空间波束形成器的 SMI 实现。** 核心思想：在 SMI 之前先把导向矢量投影到信号子空间：

$$
\hat{\mathbf{U}}_s = [\hat{\boldsymbol{\phi}}_1, \ldots, \hat{\boldsymbol{\phi}}_D], \qquad
\mathbf{v}_{proj} = \hat{\mathbf{U}}_s\hat{\mathbf{U}}_s^H\mathbf{v}_m,
$$

$$
\mathbf{w}_{es} = \frac{\hat{\mathbf{S}}_x^{-1}\mathbf{v}_{proj}}{\mathbf{v}_{proj}^H\hat{\mathbf{S}}_x^{-1}\mathbf{v}_{proj}}.
$$

**为什么这比直接 SMI 好？** ① 投影去掉了 $\mathbf{v}_m$ 在噪声子空间的分量（去噪）；② 对导向矢量失配更稳健（信号子空间"修正"了方向）；③ $D \ll N$ 时等效自由度减少，收敛更快。

> **定理 7.12**（特征空间 SMI 的收敛）：特征空间波束形成器的平均 SINR 近似为
>
> $$
> E[SINR_{es}] \approx \frac{SINR_{opt}\cdot K}{K + SINR_{opt}\cdot D},
> $$
>
> 而 SMI 为 $E[SINR_{smi}] \approx \dfrac{SINR_{opt}\cdot K}{K + SINR_{opt}\cdot N}$。**关键结论：特征空间波束形成器的收敛只依赖信号个数 $D$，而非阵元数 $N$**——信号少时收敛快得多。

**子空间维数检测 + 特征空间。** 实际中 $D$ 未知，用 AIC/MDL 估计。若**欠估计**（$\hat{D} < D$）会丢掉信号分量、性能严重下降；对策：低 SNR 时宁可**过估计**（用 AIC），让下一级处理滤除多余分量。

**子空间跟踪。** 环境时变时子空间也在变化，可每来一个新快拍更新子空间估计。代表性算法：**ROSE**（秩 1 更新特征分解）、**PAST**（投影近似子空间跟踪）、**LORAF**（低秩自适应滤波）。

---

## 7.9 波束空间波束形成器（Beamspace Beamformers）

**波束空间 SMI。** 步骤：① 用 $N_{bs}$ 个波束覆盖感兴趣区域 $\mathbf{x}_{bs} = \mathbf{B}_{bs}^H\mathbf{x}$；② 计算波束空间采样协方差 $\hat{\mathbf{S}}_{x,bs}$；③ 计算波束空间导向矢量 $\mathbf{v}_{bs} = \mathbf{B}_{bs}^H\mathbf{v}_m$；④ 应用 MPDR：

> **定理 7.13**（波束空间 SMI）：
>
> $$
> \mathbf{w}_{bs} = \frac{\hat{\mathbf{S}}_{x,bs}^{-1}\mathbf{v}_{bs}}{\mathbf{v}_{bs}^H\hat{\mathbf{S}}_{x,bs}^{-1}\mathbf{v}_{bs}},
> \qquad \hat{\mathbf{S}}_{x,bs} = \frac{1}{K}\sum_k\mathbf{x}_{bs}(k)\mathbf{x}_{bs}^H(k).
> $$

**为什么波束空间处理有效？** ① **收敛速度提升**——SMI 收敛需 $K \approx 2N_{bs}$（而非 $2N$），$N_{bs} \ll N$ 时大幅加速；② **计算量降低**——矩阵求逆从 $O(N^3)$ 降到 $O(N_{bs}^3)$；③ **干扰抑制**——波束区域外的干扰被波束方向图自然衰减，无需自适应抑制。

**共轭对称波束空间。** 若波束空间矩阵列共轭对称，波束空间协方差矩阵为**实**的，可用实数运算、计算量减半。

---

## 7.10 宽带波束形成器的自适应实现（Adaptive Broadband Beamformers）

第 6.12 节的宽带方法在此给出自适应版本。每个传感器后接一个 $L$ 阶 FIR 滤波器，总自由度 $NL$。

**SMI 实现。** 定义 $NL \times 1$ "延迟堆积"矢量：

$$
\tilde{\mathbf{x}}(k) = [\mathbf{x}^T(k),\, \mathbf{x}^T(k-1),\, \ldots,\, \mathbf{x}^T(k-L+1)]^T,
$$

然后直接应用 SMI：

$$
\hat{\mathbf{S}}_{\tilde{x}} = \frac{1}{K}\sum_k\tilde{\mathbf{x}}(k)\tilde{\mathbf{x}}^H(k), \qquad
\mathbf{w} = \frac{\hat{\mathbf{S}}_{\tilde{x}}^{-1}\mathbf{v}_{\text{tapped}}}{\mathbf{v}_{\text{tapped}}^H\hat{\mathbf{S}}_{\tilde{x}}^{-1}\mathbf{v}_{\text{tapped}}},
$$

其中 $\mathbf{v}_{\text{tapped}}$ 是 $NL \times 1$ 的"延迟导向矢量"。**LMS 实现**：每个 FIR 抽头用 LMS 更新 $w_{n,m}(k+1) = w_{n,m}(k) + \mu\,x_n(k-m)e^*(k)$，结构简单、计算量 $O(NL)$。

---

## 7.11 本章总结

**自适应波束形成的完整分类树。**

```
自适应波束形成器
├── 块处理（环境平稳）
│   ├── SMI（直接矩阵求逆）
│   │   ├── 标准 SMI（K ≥ 2N）
│   │   └── 对角加载 SMI（K < N 也可工作）
│   └── 特征空间 SMI（降秩处理）
├── 递推处理（慢时变环境）
│   ├── RLS（O(N²) 复杂度）
│   ├── QRD-RLS（数值稳定）
│   └── GSC-RLS（约束分离）
└── 随机梯度处理（实时 / 快时变）
    ├── LMS（O(N) 复杂度）
    ├── NLMS（功率归一化）
    ├── Frost LMS（约束 LMS）
    └── GSC-LMS（约束分离 + LMS）
```

**核心指标对比。**

**表 7.4** 三大自适应算法对比

| 算法 | 每步复杂度 | 收敛快拍数 | 稳态误差 | 数值稳定性 |
| --- | --- | --- | --- | --- |
| SMI | $O(N^3)$ | 约 $2N$ | 0（渐近） | 中等 |
| SMI + DL | $O(N^3)$ | $< N$ | $>0$（牺牲） | 好 |
| RLS | $O(N^2)$ | 约 $2N$ | 0（渐近） | 差（需 QRD 改进） |
| QRD-RLS | $O(N^2)$ | 约 $2N$ | 0（渐近） | 好 |
| LMS | $O(N)$ | 取决于特征值扩展 | 失调 $>0$ | 好 |

**贯穿本章的核心思想。**

1. **2N 规则**：SMI 需约 $2N$ 个（无信号）快拍才能达到 3 dB 以内的最优性能；RMB 结果 $E[\rho] = (K+2-N)/(K+1)$ 是它的精确表述。

2. **RMB 结果的前提是信号无污染**：用含信号的 $\hat{\mathbf{S}}_x$ 训练（MPDR）会自消，损失远大于 2N 规则预测——工程上务必用无信号数据训练。

3. **对角加载是"万能药"**：在 SMI、RLS、LMS 中都可用，同时对抗有限样本、失配与扰动；经验 $LNR \approx SNR + 10$ dB。

4. **降维是加速收敛的关键**：特征空间（依赖 $D$ 而非 $N$）与波束空间（依赖 $N_{bs}$ 而非 $N$）都把收敛所需快拍数从 $O(N)$ 降到 $O(\text{小量})$。

5. **LMS 的权衡**：步长 $\mu$ 大则收敛快但失调大，$\mu$ 小则相反；失调量 $\mathcal{M} \approx (\mu/2)\text{tr}(\mathbf{S}_x)$。

6. **检测信号个数是"把问题说清楚"的前提**：任何特征空间处理或 DOA 估计前先用 AIC/MDL 判断有几个信号——低 SNR 用 AIC（宁可过估计），高 SNR 用 MDL（一致估计）。
