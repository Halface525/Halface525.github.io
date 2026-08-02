---
data: 2026-08-03
tags:
  - 阵列处理
  - 信号处理
  - 空时过程
lastdate: 2026-08-03
auther: Halface
---
前四章在**确定性**框架下处理阵列：信号是方向已知的平面波，噪声被视作外部干扰，性能由波束宽度、旁瓣高度等确定性指标刻画。实际中信号与噪声都是**随机过程**——信号本身随机（语音、通信、雷达回波），噪声无处不在（热噪声、环境噪声），信号方向与干扰位置通常未知。本章建立**空时随机过程的数学语言**（快拍模型、二阶矩、频率-波数谱、空间谱矩阵、特征分解、参数化模型），为第 6–9 章的最优波束形成、自适应处理与参数估计奠定统计基础。这与 DEMT 前三卷的类比是：时域处理用时间采样与功率谱 $S(\omega)$，空域处理则需空间采样（阵元）与空间谱 $S(\mathbf{k})$——空时处理是二者的结合，每个传感器既提供时间波形也提供空间位置。对应原书第 5 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 5.1** 本章符号表（Notation）

| 符号 | 含义与说明 |
| --- | --- |
| **快拍与信号模型 / Snapshot and Signal Models** | |
| $\mathbf{x}(k)$ | 时域快拍（snapshot），$N$ 元阵列在时刻 $k$ 的输出矢量 |
| $\mathbf{X}(\omega_m, k)$ | 频域快拍，第 $k$ 段、频率仓 $\omega_m$ 的输出矢量 |
| $N$ | 阵元数（number of sensors） |
| $D$ | 信号源个数（number of sources） |
| $\Delta T$ | 时间段长度（segment length） |
| $K$ | 时间段 / 快拍个数 |
| $\omega_m = \omega_c + m\omega_\Delta$ | 频率仓（frequency bin），$\omega_\Delta = 2\pi/\Delta T$ |
| $B_s$ | 信号带宽（signal bandwidth） |
| $\Delta T_{\max}$ | 阵列最大传播时延差 |
| $\mathbf{v}(\mathbf{k})$ | 阵列流形向量（array manifold vector） |
| $\mathbf{V}(\Psi)$ | 阵列流形矩阵（manifold matrix），$N \times D$ |
| $\mathbf{F}(\omega_m,k)$ | $D \times 1$ 源信号频域快拍矢量 |
| $\mathbf{N}(\omega_m,k)$ | 噪声频域快拍矢量 |
| $\mathbf{R}_x$ | 阵列协方差矩阵，$\mathbf{R}_x = E[\mathbf{x}\mathbf{x}^H]$ |
| **空时随机过程 / Space-Time Processes** | |
| $f(t,\mathbf{p})$ | 时变随机波场（random wavefield） |
| $m_f$ | 波场均值（mean） |
| $K_f(\tau;\Delta\mathbf{p})$ | 协方差函数（covariance function） |
| $P_f(\omega;\mathbf{k})$ | 频率-波数谱（frequency-wavenumber spectrum） |
| $P_f(\omega)$ | 时域功率谱（power spectral density） |
| $\mathbf{k}_s$ | 信号波数（signal wavenumber） |
| $\mathbf{S}_f$ | 信号协方差矩阵（signal covariance matrix），$D \times D$ |
| $\sigma_w^2$ | 白噪声功率（white-noise power） |
| $\rho$ | 时间相关系数（temporal correlation coefficient） |
| $B_{12}$ | 空间相关系数，$B_{12} = \frac{1}{N}\mathbf{v}^H(\mathbf{k}_1)\mathbf{v}(\mathbf{k}_2)$ |
| **阵列响应 / Array Response** | |
| $\mathbf{S}_x(\omega)$ | 空间谱矩阵（spatial spectral matrix），$N \times N$ |
| $P_x(\omega;\mathbf{k})$ | 入射场的频率-波数谱 |
| $R_w(\omega;\Delta\mathbf{p})$ | 相关阵列（co-array），权值的自相关 |
| $S_y(\omega)$ | 阵列输出功率谱 |
| **特征分解 / Eigendecomposition** | |
| $\lambda_i, \boldsymbol{\phi}_i$ | 空间谱矩阵的特征值 / 特征向量 |
| $\boldsymbol{U}_s$ | 信号子空间基，$\boldsymbol{U}_s = [\boldsymbol{\phi}_1,\ldots,\boldsymbol{\phi}_D]$ |
| $\boldsymbol{U}_n$ | 噪声子空间基 |
| $\mathcal{S}, \mathcal{N}$ | 信号子空间 / 噪声子空间 |
| $u_\Delta$ | 空间扩展信号的角宽度 |
| **参数化模型 / Parametric Models** | |
| $a(m),\, p$ | AR 模型系数与阶数 |
| $A(z)$ | AR 多项式，$A(z) = 1 + \sum_{m=1}^p a(m)z^{-m}$ |
| $\sigma_u^2$ | AR 激励白噪声功率 |
| $b(m),\, q$ | ARMA 模型系数与阶数 |
| $B(z)$ | ARMA 分子多项式 |
| $z_1$ | AR(1) 模型极点 |

---

## 5.1 快拍模型（Snapshot Models）

**快拍的定义。** 时域处理把连续信号按时间采样成序列 $x[k]$；阵列处理中，$N$ 个传感器各输出一个时间序列。**快拍**（snapshot）是某一时刻 $N$ 个传感器输出的矢量化：

> **定义 5.1**（快拍 / Snapshot）：第 $k$ 个快拍是 $N$ 个传感器在时刻 $t = k\Delta T$ 同时采样的输出矢量：
>
> $$
> \mathbf{x}(k) = \begin{bmatrix} x_0(k) \\ x_1(k) \\ \vdots \\ x_{N-1}(k) \end{bmatrix}.
> $$

物理上，一次快拍如同对整个阵列"拍一张快照"，得到 $N$ 维复矢量。

**频域快拍模型。** 通信与雷达中的信号通常是带通的（中心频率 $f_c$、带宽 $B_s$），对整个带宽直接处理计算量巨大。**频域快拍**把宽带信号分解成多个窄带频率仓，各仓独立处理。

构建步骤：**①** 把总观测时间 $T$ 分成 $K$ 个不重叠时间段，每段长 $\Delta T$，第 $k$ 段为 $(k-1)\Delta T \le t < k\Delta T$；**②** 在第 $k$ 段内对第 $n$ 个传感器输出做 Fourier 级数展开：

$$
X_{n,\Delta T}(\omega_m, k) = \frac{1}{\sqrt{\Delta T}}\int_{(k-1)\Delta T}^{k\Delta T} x_n(t)\, e^{-j\omega_m t}\,\mathrm{d}t,
\qquad \omega_m = \omega_c + m\omega_\Delta,\ \ \omega_\Delta = \frac{2\pi}{\Delta T};
$$

**③** 把 $N$ 个传感器在同一频率仓 $\omega_m$ 上的 Fourier 系数组成 $N$ 维矢量 $\mathbf{X}_{\Delta T}(\omega_m, k)$。

> **定理 5.1**（频域快拍的适用条件与统计独立性）：频域快拍模型成立需两个条件：
>
> ① **时间窗长于阵列传播时间**：$\Delta T \gg \Delta T_{\max} \triangleq \max_{n,m,\mathbf{u}}\{\Delta T_{nm}(\mathbf{u})\}$——否则不同阵元接收的信号来自不同时间窗，相关模型失效；
> ② **时间带宽积足够大**：$B_s \cdot \Delta T \gg 1$——此时**不同频率仓的快拍近似不相关**，这正是所需的统计独立性。
>
> 物理直觉：$B_s\Delta T$ 大时，每个频率仓带宽 $\Delta f = 1/\Delta T$ 很窄，不同仓在频域上相距远，其 Fourier 系数统计独立——**把宽带问题分解成 $M$ 个独立的窄带问题**。

**快拍的统计特性——高斯模型。** 当输入为**实 Gauss 随机过程**时，频域快拍 $\mathbf{X}_{\Delta T}(\omega_m, k)$ 是**循环复 Gauss 随机矢量**。

> **定义 5.2**（循环复 Gauss / Circular Complex Gaussian）：复随机变量 $Z = X + jY$ 是循环复高斯的，若 $X$、$Y$ 联合 Gauss、$E[Z] = 0$ 且 $E[Z^2] = 0$（**循环性**）。循环性意味着 $Z$ 的实部与虚部独立同分布，且 $E[X^2] = E[Y^2]$、$E[XY] = 0$。

> **定理 5.2**（循环复 Gauss 概率密度）：循环复 Gauss 快拍 $\mathbf{X}$（协方差 $\mathbf{R}_x$）的概率密度为
>
> $$
> p_{\mathbf{X}}(\mathbf{x}) = \frac{1}{\pi^N \det(\mathbf{R}_x)}\exp\!\left[-\mathbf{x}^H \mathbf{R}_x^{-1} \mathbf{x}\right].
> $$
>
> 其重要性在于：**Gauss 分布完全由二阶矩（均值与协方差）决定**——知道 $\mathbf{R}_x$ 即知信号的完整统计特性，无需更高阶统计量。

**平面波快拍模型。** 这是全书最常用的信号模型。设 $D$ 个平面波入射，第 $i$ 个信号的波数为 $\mathbf{k}_i$、频域快拍复振幅为 $F_i(\omega_m,k)$：

> **定理 5.3**（平面波快拍模型）：第 $k$ 个频域快拍为
>
> $$
> \mathbf{X}(\omega_m, k) = \sum_{i=1}^{D}\mathbf{v}(\omega_m,\mathbf{k}_i)\, F_i(\omega_m,k) + \mathbf{N}(\omega_m,k),
> $$
>
> 矩阵形式
>
> $$
> \boxed{\mathbf{X}(\omega_m, k) = \mathbf{V}(\omega_m,\Psi)\, \mathbf{F}(\omega_m, k) + \mathbf{N}(\omega_m, k)},
> $$
>
> 其中 $\mathbf{V}$ 为 $N \times D$ 阵列流形矩阵，$\mathbf{F}$ 为 $D \times 1$ 源信号矢量。该模型涵盖四种典型情形：

**表 5.2** 平面波快拍模型的四种典型情形

| 情形 | 信号模型 | 噪声模型 | 典型应用 |
| --- | --- | --- | --- |
| S1 | Gauss 随机，$\mathbf{S}_f$ 未知 | N1：白噪声，$\sigma_w^2$ 已知 | 被动声纳 |
| S2 | Gauss 随机，$\mathbf{S}_f$ 未知 | N2：白噪声，$\sigma_w^2$ 未知 | 雷达检测 |
| S3 | 未知非随机信号 | N1：白噪声已知 | 通信信号复制 |
| S4 | 已知波形（训练序列） | N1：白噪声已知 | 信道估计 |

**窄带时域快拍模型。** 若满足窄带条件 $B_s \Delta T_{\max} \ll 1$，可直接在时域工作而不必先做 Fourier 变换：

$$
\mathbf{x}(k) = \mathbf{V}(\Psi)\,\mathbf{f}(k) + \mathbf{n}(k), \qquad k = 1, 2, \ldots, K,
$$

其中 $\mathbf{f}(k)$ 为 $D \times 1$ 复包络采样，$\mathbf{n}(k)$ 为噪声采样。

> **定理 5.4**（窄带时域与频域的等价性）：窄带时域快拍与窄带频域快拍的**空域统计特性完全相同**。因此，在频域推导的所有空域处理算法都可直接用于窄带时域。

---

## 5.2 空时随机过程（Space-Time Random Processes）

**从离散到连续。** 快拍模型是离散的（采样点），而物理世界是连续的——信号在空间与时间上连续分布。需要连续模型描述信号场，再通过对阵列位置采样得到离散快拍。

**二阶矩特性。** 波场 $f(t,\mathbf{p})$ 的均值与协方差函数：

$$
m_f(t,\mathbf{p}) = E[f(t,\mathbf{p})],
\qquad
K_f(t_1,t_2;\mathbf{p}_1,\mathbf{p}_2) = E\left[\left(f(t_1,\mathbf{p}_1) - m_f\right)\left(f(t_2,\mathbf{p}_2) - m_f\right)^*\right].
$$

> **定义 5.3**（平稳性与均匀性）：若过程**时间平稳**、**空间均匀**，协方差只依赖时间差 $\tau$ 与空间差 $\Delta\mathbf{p}$：
>
> $$
> K_f(\tau;\Delta\mathbf{p}) = E[f(t+\tau,\mathbf{p}+\Delta\mathbf{p})\, f^*(t,\mathbf{p})].
> $$

**频率-波数谱。** 这是最重要的量之一。

> **定理 5.5**（频率-波数谱 = 协方差的二维 Fourier 变换）：对协方差函数做二维 Fourier 变换（时间 $\to$ 频率、空间 $\to$ 波数）：
>
> $$
> \boxed{P_f(\omega;\mathbf{k}) = \int_{-\infty}^{\infty}\int_{-\infty}^{\infty} K_f(\tau;\Delta\mathbf{p})\, e^{-j(\omega\tau - \mathbf{k}^T\Delta\mathbf{p})}\,\mathrm{d}\tau\,\mathrm{d}\Delta\mathbf{p}},
> $$
>
> $P_f(\omega;\mathbf{k})$ 是**空时功率谱**：在频率 $\omega$、波数 $\mathbf{k}$ 处信号的能量密度。对平面波，它在信号波数 $\mathbf{k}_s$ 处为**冲激**。

**平面波传播的连续模型。** 频率为 $\omega$、方向为 $\mathbf{a}$ 的平面波，波数 $\mathbf{k} = (\omega/c)\mathbf{a}$：

> **定理 5.6**（平面波的频率-波数谱）：平面波的谱为波数域冲激：
>
> $$
> P_f(\omega;\mathbf{k}) = P_f(\omega)\, \delta(\mathbf{k} - \mathbf{k}_s).
> $$

> **定理 5.7**（各向同性噪声的空间相关）：噪声从所有方向均匀到达时，谱只依赖波数模 $|\mathbf{k}|$，空间相关函数只依赖距离 $|\Delta\mathbf{p}|$：
>
> $$
> K_f(\omega;\Delta\mathbf{p}) = P_f(\omega)\, \operatorname{sinc}\!\left(\frac{\omega}{c}|\Delta\mathbf{p}|\right) = P_f(\omega)\,\operatorname{sinc}(k_0|\Delta\mathbf{p}|).
> $$
>
> 这是各向同性随机场的标准结果：任意两位置的噪声相关性只取决于其间距，不取决于方向。

**一维与二维投影。** 阵列可能是一维（线阵）或二维（面阵），需把三维空时场投影到阵列所在维度。

$$
P_f^{(1D)}(\omega;k_z) = \int\int P_f^{(3D)}(\omega;k_x,k_y,k_z)\,\mathrm{d}k_x\,\mathrm{d}k_y,
\qquad
P_f^{(2D)}(\omega;k_x,k_y) = \int P_f^{(3D)}(\omega;k_x,k_y,k_z)\,\mathrm{d}k_z.
$$

线阵只"看"波数在 $z$ 轴的分量，对 $k_x$、$k_y$ 方向平均掉；面阵则对 $k_z$ 积分。

---

## 5.3 空间谱矩阵与阵列响应（Arrays and the Spatial Spectral Matrix）

**空间谱矩阵。** 这是第 5 章最重要的量。

> **定义 5.4**（空间谱矩阵 / Spatial Spectral Matrix）：离散阵列的空间谱矩阵定义为
>
> $$
> \mathbf{S}_x(\omega) = E[\mathbf{x}(\omega)\mathbf{x}^H(\omega)],
> $$
>
> 其第 $(n,m)$ 个元素为传感器 $n$ 与 $m$ 之间的**互谱**。

> **定理 5.8**（空间谱矩阵的元素）：互谱等于入射场频率-波数谱的波数积分：
>
> $$
> [\mathbf{S}_x(\omega)]_{nm} = \int P_x(\omega;\mathbf{k})\, e^{-j\mathbf{k}^T(\mathbf{p}_n - \mathbf{p}_m)}\,\mathrm{d}\mathbf{k}.
> $$
>
> $\mathbf{S}_x(\omega)$ 的地位：它包含阵列输入的所有二阶统计信息——是第 6 章最优波束形成器的核心输入、第 7 章自适应算法的估计目标、第 8–9 章参数估计的统计基础。

**相关阵列（Co-array）。** 第 3.9 节在最小冗余阵列中引入过"相关阵列"，现在从统计角度重新理解。

> **定义 5.5**（相关阵列 / Co-array）：相关阵列 $R_w(\omega;\Delta\mathbf{p})$ 是权值与其自身的空间相关函数：
>
> $$
> R_w(\omega;\Delta\mathbf{p}) = \int \mathbf{w}^H(\mathbf{p})\, \mathbf{w}(\mathbf{p} + \Delta\mathbf{p})\,\mathrm{d}\mathbf{p}.
> $$

阵列输出功率为

$$
S_y(\omega) = \int P_x(\omega;\mathbf{k})\, |B(\omega;\mathbf{k})|^2\,\mathrm{d}\mathbf{k},
$$

而 $|B|^2$ 的 Fourier 变换正是 $R_w$——**输出功率谱 = 输入空间谱与相关阵列 Fourier 变换的卷积**。从采样定理视角：若相关阵列在空间上覆盖了所有需要的间隔（无"空洞"），就能从有限阵元重构完整的 $P_x(\omega;\mathbf{k})$。

---

## 5.4 正交展开与特征分解（Orthogonal Expansions）

**特征分解。** $\mathbf{S}_x(\omega)$ 是 Hermitian 矩阵，可分解为特征值与特征向量：

> **定理 5.9**（空间谱矩阵的特征分解）：
>
> $$
> \mathbf{S}_x = \sum_{i=1}^{N}\lambda_i \boldsymbol{\phi}_i\boldsymbol{\phi}_i^H = \mathbf{U}\boldsymbol{\Lambda}\mathbf{U}^H,
> $$
>
> 其中 $\lambda_1 \ge \lambda_2 \ge \cdots \ge \lambda_N \ge 0$。物理意义：每个特征向量 $\boldsymbol{\phi}_i$ 定义一个**空域模式**（"特征波束"），特征值 $\lambda_i$ 是该模式的功率；快拍 $\mathbf{x} = \sum_i x_i\boldsymbol{\phi}_i$，其中 $x_i = \boldsymbol{\phi}_i^H\mathbf{x}$ 为互不相关随机变量、方差 $\lambda_i$。

**信号子空间与噪声子空间。** 这是现代阵列处理最核心的概念之一。设 $D$ 个平面波（$D < N$）、白噪声功率 $\sigma_w^2$，则

$$
\mathbf{S}_x = \mathbf{V}\mathbf{S}_f\mathbf{V}^H + \sigma_w^2\mathbf{I}.
$$

> **定义 5.6**（信号子空间与噪声子空间）：前 $D$ 个（大）特征值对应信号 + 噪声，$\lambda_i = \lambda_i^{(s)} + \sigma_w^2$（$i = 1,\ldots,D$）；后 $N-D$ 个（小）特征值只对应噪声，$\lambda_i = \sigma_w^2$（$i = D+1,\ldots,N$）。对应的特征向量张成两个正交子空间：
>
> - $\mathcal{S} = \text{span}\{\boldsymbol{\phi}_1,\ldots,\boldsymbol{\phi}_D\}$：**信号子空间**；
> - $\mathcal{N} = \text{span}\{\boldsymbol{\phi}_{D+1},\ldots,\boldsymbol{\phi}_N\}$：**噪声子空间**。

> **定理 5.10**（子空间正交性与 MUSIC 基础）：信号子空间 $\mathcal{S}$ 与阵列流形矩阵 $\mathbf{V}$ 的列空间**相同**，噪声子空间与 $\mathcal{S}$ **正交**。因此阵列流形向量与全部噪声特征向量正交：
>
> $$
> \mathbf{v}^H(\mathbf{k}_i)\,\boldsymbol{\phi}_j = 0, \qquad i = 1,\ldots,D;\ \ j = D+1,\ldots,N.
> $$
>
> **这正是第 9 章 MUSIC 算法的理论基础**：通过搜索使 $\mathbf{v}(\mathbf{k})$ 与噪声子空间"最正交"的 $\mathbf{k}$ 来估计 DOA。

![图 5.1：空间谱矩阵的特征值谱（N=10，D=2 平面波 + 白噪声 σw²=1）。前 2 个特征值为 λ=NP_i+σw²（信号子空间），后 8 个等于 σw²（噪声子空间）。](../pic/ch5_特征值谱.png)

> **定理 5.11**（两平面波的特征值结构）：对功率 $P_1$、$P_2$、时间相关系数 $\rho$ 的两个平面波，两个大特征值由时间相关 $\rho$ 与空间相关 $B_{12}$ 共同决定（近似式）：
>
> $$
> \lambda_{1,2} \approx \frac{N}{2}\left[P_1 + P_2 \pm \sqrt{(P_1-P_2)^2 + 4P_1P_2|\rho|^2|B_{12}|^2}\right] + \sigma_w^2,
> $$
>
> 其中 $B_{12} = \frac{1}{N}\mathbf{v}^H(\mathbf{k}_1)\mathbf{v}(\mathbf{k}_2)$ 为空间相关系数（常规波束方向图在另一信号方向的值）。该式在信号空间上充分分离（$|B_{12}| \ll 1$）时精确，一般情形为近似（数值核对见仿真脚本）。三个极限情形：
>
> - $\rho = 0$（不相关）：$\lambda_1 \approx N P_1 + \sigma_w^2$，$\lambda_2 \approx N P_2 + \sigma_w^2$——两信号独立贡献；
> - $|\rho| = 1$（相干）：较小特征值坍缩向 $\lambda_2 \to \sigma_w^2$——**信号子空间退化**，MUSIC 等算法失效；
> - $|B_{12}| = 1$（空间重合）：同样退化，两信号无法分辨。
>
> **空间平滑的动机**：信号相干时信号子空间维数小于信号数，**前后向空间平滑**通过平均不同子阵的协方差矩阵来"去相干"（第 6.12 节）。

**空间扩展信号的子空间。** 若信号非理想平面波，而是在空间上有一定扩展（来自有限大小区域），信号子空间维数**大于信号个数**。

> **定理 5.12**（空间扩展信号的子空间维数）：信号在 $u$ 空间均匀分布在宽度 $u_\Delta$ 的区间内时，空间谱矩阵元素
>
> $$
> [\mathbf{S}_x]_{nm} \propto \operatorname{sinc}\!\left(\frac{\pi u_\Delta}{2}(n-m)\right),
> $$
>
> 大特征值个数约为 $N \cdot u_\Delta/2$。工程意义：空间扩展的信号需要**更多特征向量**描述信号子空间，影响第 7 章特征空间波束形成器的子空间维数选择。

> **例 5.1**（空间扩展的维数估计）：$N = 20$ 元标准线阵，信号在 $u$ 空间宽度 $u_\Delta = 0.4$，则大特征值个数约 $20 \times 0.4/2 = 4$——信号子空间维数约为 $4$，而非信号源个数。若误按点源假设取 $D = 1$，信号子空间将缺失大量信息。

**特征矢量波束空间处理器。** 特征分解提供理解波束空间处理的另一视角。把输入投影到信号子空间：

$$
\mathbf{x}_s = \mathbf{U}_s^H \mathbf{x}, \qquad \mathbf{U}_s = [\boldsymbol{\phi}_1, \ldots, \boldsymbol{\phi}_D].
$$

其价值：① $\mathbf{x}_s$ 维数为 $D \ll N$；② 包含估计信号参数所需的**所有信息**（充分统计量）；③ 噪声在 $\mathbf{x}_s$ 中仍为白（$\mathbf{U}_s^H\sigma_w^2\mathbf{I}\mathbf{U}_s = \sigma_w^2\mathbf{I}$）。**在特征矢量波束空间中，问题由 $N$ 维降为 $D$ 维——降维的核心思想。**

---

## 5.5 参数化波数模型（Parametric Wavenumber Models）

**参数化的动机。** 有些场景不直接估计 DOA，而是估计整个空间谱的形状。空间扩展噪声可用**有理函数**（AR / ARMA）模型描述，从而用很少的参数表达复杂的空间谱。

**AR 模型。**

> **定义 5.7**（AR 模型 / Autoregressive Model）：第 $n$ 个阵元输出 $x(n)$ 是其前 $p$ 个输出的线性组合加白噪声激励 $u(n)$：
>
> $$
> x(n) = -\sum_{m=1}^{p} a(m)\, x(n-m) + u(n),
> $$
>
> $z$ 变换多项式 $A(z) = 1 + a(1)z^{-1} + \cdots + a(p)z^{-p}$。

> **定理 5.13**（AR 空间谱）：AR 模型的空间谱为
>
> $$
> \boxed{P(\psi) = \frac{\sigma_u^2}{|A(e^{j\psi})|^2}},
> $$
>
> 在分母为零（极点）处出现**谱峰**。$p$ 阶 AR 模型最多描述 $p/2$ 个谱峰（零/极点复共轭成对出现）。

> **例 5.2**（复 AR(1)）：$P(\psi) = \dfrac{\sigma_u^2}{|1 - z_1 e^{-j\psi}|^2}$，其中 $z_1$ 为极点。$|z_1| \to 1$ 时谱在 $\psi = \arg(z_1)$ 处形成尖锐峰——**趋近平面波**。

![图 5.2：复 AR(1) 空间谱随 |z1| 变化。|z1| 越接近 1，谱峰越尖锐，越趋近平面波的冲激谱。](../pic/ch5_AR空间谱.png)

**AR 模型与平面波的关系。** AR 模型的极点对应信号的 DOA。设 $D$ 个平面波加白噪声，空间谱在 $D$ 个方向有峰；一个 $2D$ 阶 AR 模型可很好近似（每个平面波对应一个复共轭极点对）。**若能估计 AR 系数 $a(1),\ldots,a(p)$，对 $A(z)$ 求根即得 DOA——这是第 8 章 IQML 算法的理论基础。**

**ARMA 模型。**

> **定义 5.8**（ARMA 模型 / Autoregressive Moving Average）：自回归滑动平均模型
>
> $$
> x(n) = -\sum_{m=1}^{p} a(m)\,x(n-m) + \sum_{m=0}^{q} b(m)\,u(n-m),
> $$
>
> 空间谱为 $P(\psi) = \sigma_u^2\,\dfrac{|B(e^{j\psi})|^2}{|A(e^{j\psi})|^2}$。

> **定理 5.14**（ARMA 与 AR 的关系）：ARMA 用更少参数描述更复杂谱形，但参数估计远比 AR 困难。由 **Wold 分解定理**，任何平稳过程可表示为 MA 过程（等价地，无穷阶 AR 过程）——**用足够高阶的 AR 可任意逼近任意空间谱**，因此实际中常用高阶 AR 近似 ARMA。

---

## 5.6 本章总结

**从确定性到统计性的完整路径。** 本章完成了由确定性世界（第 2–4 章）到统计性世界的过渡：

```
确定性世界（信号方向已知、噪声未建模）
    ↓
快拍模型 —— 离散随机过程（频域快拍把宽带分解为多个独立窄带）
    ↓
连续空时随机过程（二阶矩、频率-波数谱）
    ↓
阵列响应 —— 空间谱矩阵 S_x(ω)
    ↓
特征分解 —— 信号子空间（DOA 信息）与噪声子空间（MUSIC 基础）
    ↓
参数化模型 —— AR/ARMA 空间谱
```

**必须掌握的核心概念。**

**表 5.3** 第 5 章核心概念一览

| 概念 | 定义 | 作用 |
| --- | --- | --- |
| 快拍 $\mathbf{x}(k)$ | $N$ 个传感器同一时刻的输出矢量 | 所有统计处理的基本数据单元 |
| 空间谱矩阵 $\mathbf{S}_x$ | $E[\mathbf{x}\mathbf{x}^H]$ | 包含全部二阶统计信息 |
| 信号子空间 | 前 $D$ 个特征向量张成的空间 | 包含信号的 DOA 信息 |
| 噪声子空间 | 后 $N-D$ 个特征向量张成的空间 | 与全部信号流形正交 $\to$ MUSIC |
| AR 模型 | $x(n) = -\sum a(m)x(n-m) + u(n)$ | 用少量参数描述空间谱 |

**贯穿本章的核心思想。**

1. **快拍是理解后续算法的基础**——第 6 章最优波束形成、第 7 章自适应算法、第 8–9 章 DOA 估计全部基于快拍模型；
2. **特征分解是"升维思考"的关键**——把 $N$ 维观测空间划分为信号子空间与噪声子空间，是 MUSIC、ESPRIT 等算法的核心；
3. **信号子空间 = 阵列流形张成的空间**——知道信号子空间即知 DOA（反过去找与之匹配的阵列流形）；
4. **AR 模型是连接线阵与时域信号处理的桥梁**——时域 AR 模型的概念可原样迁移到空间；
5. **$B_s\Delta T \gg 1$ 是频域快拍独立性的保障**——保证不同频率仓不相关，从而可并行处理各仓；
6. **$\sigma_w^2$ 总存在**——实际系统中传感器噪声永不为零，保证 $\mathbf{S}_x$ 正定、逆存在。
