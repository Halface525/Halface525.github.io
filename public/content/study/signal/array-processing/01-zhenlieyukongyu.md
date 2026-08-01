---
data: 2026-07-30
tags:
  - 阵列处理
  - 信号处理
  - 波束成形
lastdate: 2026-07-30
auther: Halface
---
本章介绍阵列信号处理的核心基础——阵列与空域滤波器（spatial filters）。内容涵盖阵列与孔径的基本概念、平面波入射模型（plane-wave incidence model）、波数向量（wavenumber vector）、时域输入-输出模型、阵列流形向量（array manifold vector）、频率-波数响应函数（frequency-wavenumber response）、波束方向图（beampattern）及窄带近似（narrowband approximation），对应原书第 2 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 2.1** 本章符号表（Notation）

| 符号                                                     | 含义与说明                                                                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **阵列几何 / Array Geometry**                      |                                                                                                                        |
| $N$                                                    | 阵元数（number of sensors），$N \in \mathbb{N}$，标量                                                                |
| $n$                                                    | 阵元索引（sensor index），$n = 0, 1, \ldots, N-1$                                                                    |
| $\mathbf{p}_n$                                         | 第$n$ 个传感器三维位置（3-D position），$\mathbf{p}_n \in \mathbb{R}^3$                                            |
| $\mathcal{P}$                                          | 传感器位置集合（set of sensor positions），$\mathcal{P} = \{\mathbf{p}_0, \ldots, \mathbf{p}_{N-1}\}$                |
| $d$                                                    | 阵元间距（inter-element spacing），ULA 参数，单位 m                                                                    |
| $L$                                                    | 阵列孔径长度（aperture length），$L = (N-1)d$，单位 m                                                                |
| $D$                                                    | 孔径尺度（aperture size），$\Delta\theta \propto \lambda/D$                                                          |
| $L/\lambda$                                            | 电尺寸（electrical size），归一化孔径，无量纲                                                                          |
| **波场与信号 / Wavefield and Signals**             |                                                                                                                        |
| $f(t, \mathbf{p})$                                     | 时变波场（time-varying wavefield），$t$ 为时间，$\mathbf{p}$ 为空间位置                                            |
| $f_n(t)$                                               | 第$n$ 个传感器接收信号（received signal），$f_n(t) = f(t, \mathbf{p}_n)$                                           |
| $s(t)$                                                 | 复包络（complex envelope），基带信号，带宽$B$                                                                        |
| $s_{\text{RF}}(t)$                                     | 实带通信号（real bandpass signal），$s_{\text{RF}}(t) = \sqrt{2}\,\Re\{s(t) e^{j\omega_c t}\}$                       |
| $s_I(t), s_Q(t)$                                       | 同相/正交分量（I/Q components），$s(t) = s_I(t) + j s_Q(t)$                                                          |
| $\mathbf{x}(t)$                                        | 阵列输出向量（array output vector），$\mathbf{x}(t) \in \mathbb{C}^N$                                                |
| $\mathbf{n}(t)$                                        | 加性噪声向量（additive noise vector），零均值、空间白化                                                                |
| $F(\omega)$                                            | 原点处信号频谱（spectrum at origin），Fourier 变换                                                                     |
| $F(\omega,\mathbf{p})$                                 | 位置$\mathbf{p}$ 处频谱，$F(\omega,\mathbf{p}) = F(\omega) e^{-j\mathbf{k}^T\mathbf{p}}$                           |
| **方向与波数 / Direction and Wavenumber**          |                                                                                                                        |
| $\mathbf{a}$                                           | 单位方向向量（unit direction vector），$\|\mathbf{a}\|_2 = 1$，指向传播方向                                          |
| $\theta$                                               | 方位角（azimuth angle），或与阵列轴线的夹角，依上下文                                                                  |
| $\phi$                                                 | 俯仰角（elevation angle）                                                                                              |
| $u_x, u_y, u_z$                                        | 方向余弦（direction cosines），$u_x^2 + u_y^2 + u_z^2 = 1$                                                           |
| $\mathbf{k}$                                           | 波数向量（wavenumber vector），$\mathbf{k} = \frac{\omega}{c}\mathbf{a} = \frac{2\pi}{\lambda}\mathbf{a}$            |
| $k_z$                                                  | 波数$z$ 分量（$z$-component of $\mathbf{k}$），ULA 仅依赖此分量                                                  |
| $\omega$                                               | 角频率（angular frequency），$\omega = 2\pi f$，单位 rad/s                                                           |
| $\omega_c$                                             | 载波角频率（carrier angular frequency），$\omega_c = 2\pi f_c$                                                       |
| $f_c$                                                  | 载波频率（carrier frequency），单位 Hz                                                                                 |
| $B$                                                    | 信号带宽（signal bandwidth），窄带条件：$B \ll f_c$                                                                  |
| $c$                                                    | 传播速度（propagation speed），单位 m/s                                                                                |
| $\lambda$                                              | 波长（wavelength），$\lambda = c/f$                                                                                  |
| **时延与电角度 / Time Delay and Electrical Angle** |                                                                                                                        |
| $\tau_n$                                               | 第$n$ 个传感器时延（time delay），$\tau_n = \mathbf{a}^T\mathbf{p}_n / c$                                          |
| $\psi$                                                 | 电角度 / 归一化波数（electrical angle），$\psi = \frac{2\pi d}{\lambda}\cos\theta$，ULA 专用                         |
| **阵列处理量 / Array Processing Quantities**       |                                                                                                                        |
| $\mathbf{v}(\mathbf{k})$                               | 阵列流形向量（array manifold vector / steering vector），$\mathbf{v}(\mathbf{k}) \in \mathbb{C}^N$                   |
| $\mathbf{V}(\mathbf{K})$                               | 阵列流形矩阵（array manifold matrix），$\mathbf{V} \in \mathbb{C}^{N \times D}$                                      |
| $\mathbf{w}$                                           | 权重向量（weight vector），$\mathbf{w} \in \mathbb{C}^N$                                                             |
| $w_n$                                                  | 第$n$ 个传感器复权重（complex weight），$w_n \in \mathbb{C}$                                                       |
| $\Upsilon(\omega,\mathbf{k})$                          | 频率-波数响应函数（frequency-wavenumber response），$\Upsilon = \mathbf{w}^H\mathbf{v}$，复增益                      |
| $B(\theta), B(\omega,\mathbf{k})$                      | 波束方向图（beampattern），$B = \Upsilon\big\|_{\mathbf{k}=\frac{\omega}{c}\mathbf{a}(\theta)}$，复响应；$\|B\|$     |
| $\mathbf{J}$                                           | 交换矩阵（exchange matrix），反对角线全 1，其余为 0                                                                    |
| **矩阵与统计量 / Matrices and Statistics**         |                                                                                                                        |
| $\mathbf{R}_x$                                         | 阵列协方差矩阵（array covariance matrix），$\mathbf{R}_x = \mathbb{E}[\mathbf{x}\mathbf{x}^H]$                       |
| $\hat{\mathbf{R}}_{\text{FB}}$                         | 前后向平均协方差（FB-averaged covariance），$\frac{1}{2}(\hat{\mathbf{R}} + \mathbf{J}\hat{\mathbf{R}}^*\mathbf{J})$ |
| $\sigma_s^2$                                           | 信号功率（signal power）                                                                                               |
| $\sigma_n^2$                                           | 噪声功率（noise power）                                                                                                |
| $\mathbf{I}$                                           | 单位矩阵（identity matrix）                                                                                            |
| **数学符号 / Mathematical Notation**               |                                                                                                                        |
| $(\cdot)^T$                                            | 转置（transpose）                                                                                                      |
| $(\cdot)^H$                                            | 共轭转置（Hermitian / conjugate transpose）                                                                            |
| $(\cdot)^*$                                            | 复共轭（complex conjugate）                                                                                            |
| $\Re\{\cdot\}$                                         | 取实部（real part）                                                                                                    |
| $\|\cdot\|$                                            | 取绝对值 / 模（absolute value / magnitude）                                                                             |
| $\|\cdot\|_2$                                          | Euclidean 范数                                                                                                         |
| $\mathbb{E}[\cdot]$                                    | 数学期望（expectation）                                                                                                |
| $j$                                                    | 虚数单位（imaginary unit），$j^2 = -1$                                                                               |
| $\mathbb{C}^N$                                         | $N$ 维复向量空间（$N$-dim complex vector space）                                                                   |

---

## 2.1 阵列与孔径（Arrays and Apertures）

> **定义 2.1**（阵列 / Array）：阵列（array）是由 $N$ 个传感器（sensor）在空间中按一定几何布局排列而成的系统，用于对传播中的波场（wavefield）进行空间采样（spatial sampling）。第 $n$ 个传感器的三维位置记为 $\mathbf{p}_n \in \mathbb{R}^3$（$n = 0, 1, \ldots, N-1$），阵列的传感器位置集合为
>
> $$
> \mathcal{P} = \{\mathbf{p}_0, \mathbf{p}_1, \ldots, \mathbf{p}_{N-1}\}.
> $$

设空间中存在时变波场 $f(t, \mathbf{p})$，第 $n$ 个传感器在其位置处对波场做时间采样，$f_n(t) = f(t, \mathbf{p}_n)$。在**远场**（far-field）假设下，入射波可近似为平面波，波场具有平移不变的形式

$$
f(t, \mathbf{p}) = f\!\left(t - \frac{\mathbf{a}^T \mathbf{p}}{c}\right),
$$

其中 $\mathbf{a}$ 为单位方向向量，$\tau_n = \mathbf{a}^T\mathbf{p}_n/c$ 为信号到达第 $n$ 个传感器相对原点的时延。常见几何结构有**均匀线阵**（ULA，等间距直线排布）、**均匀圆阵**（UCA）、**平面阵**（如矩形栅格）与**体积阵**；其中 ULA 最简单、研究最充分，是本章重点。

> **定义 2.2**（孔径 / Aperture）：孔径（aperture）是指阵列在空间中占据的物理范围，即传感器分布所覆盖的空间区域。对于连续孔径，传感器被替换为对波场连续采样的接收面；对于离散阵列，孔径由位置集合 $\mathcal{P}$ 所张成的空间区域决定。

孔径尺寸 $D$ 决定角度分辨率：

$$
\Delta \theta \propto \frac{\lambda}{D},
$$

孔径越大、波长越短，分辨力越强——这是空域处理与时域处理的对称性：时域频率分辨力取决于观测时长，空域角度分辨力取决于孔径尺寸。连续孔径由**孔径函数**（aperture function）$w(\mathbf{p})$ 加权，接收信号为孔径上的积分 $y(t) = \int w(\mathbf{p}) f(t,\mathbf{p})\,\mathrm{d}\mathbf{p}$；离散阵列是它的空间采样近似 $y(t) \approx \sum_n w_n f(t,\mathbf{p}_n)$——这是波束成形的出发点。对 ULA，孔径长度 $L = (N-1)d$，$L/\lambda$ 称为**电尺寸**（归一化孔径），是衡量阵列性能的关键无量纲参数。

---

## 2.2 平面波入射模型（Plane-Wave Incidence Model）

> **定义 2.3**（平面波 / Plane Wave）：设源位于阵列**远场**，波前曲率可忽略，入射波在阵列尺度内近似为**平面波**。设单位向量 $\mathbf{a}$（$\|\mathbf{a}\|_2 = 1$）指向传播方向，坐标原点处接收信号为 $f(t)$，则空间任意位置 $\mathbf{p}$ 处的波场为
>
> $$
> f(t, \mathbf{p}) = f\!\left(t - \frac{\mathbf{a}^T \mathbf{p}}{c}\right),
> $$
>
> 即信号到达 $\mathbf{p}$ 处比到达原点晚 $\mathbf{a}^T\mathbf{p}/c$ 秒。

![图 2.1：平面波入射的 N 元阵列。平面波沿方向 a 传播，依次到达各阵元 p₀, p₁, …, p_{N-1}。](../pic/具有平面波输入的阵列.png)

方向向量在球坐标中可参数化为 $\mathbf{a}(\theta,\phi) = [-\sin\theta\cos\phi,\; -\sin\phi,\; -\cos\theta\cos\phi]^T$（负号源于"信号从 $\mathbf{a}$ 方向传来"的约定），亦可用方向余弦 $u_x = \cos\alpha_x,\, u_y = \cos\alpha_y,\, u_z = \cos\alpha_z$ 表示（$u_x^2+u_y^2+u_z^2 = 1$）。

> **定义 2.4**（波数向量 / Wavenumber Vector）：波数向量 $\mathbf{k} \in \mathbb{R}^3$ 定义为
>
> $$
> \boxed{\mathbf{k} = \frac{\omega}{c}\,\mathbf{a} = \frac{2\pi}{\lambda}\,\mathbf{a}},
> $$
>
> 量纲为 $\text{长度}^{-1}$，方向即传播方向，可理解为"单位长度上积累的相位变化"。

波方程约束 $\|\mathbf{k}\|_2 = 2\pi/\lambda$，故对给定频率，$\mathbf{k}$ 只能位于半径为 $2\pi/\lambda$ 的球面上——称为**可视区域**（visible region），其内部对应物理上可传播的平面波；球面外为**虚拟区域**（virtual region），在分析频率-波数响应时仍有理论价值。时延与波数满足基本恒等式

$$
\boxed{\omega \tau_n = \mathbf{k}^T \mathbf{p}_n},
$$

从而平面波相移因子可等价写作 $e^{-j\omega\tau_n} = e^{-j\mathbf{k}^T\mathbf{p}_n}$——它将时延（时间量）与位置（空间量）通过频率统一起来，使"感知方向"变为"感知相位"。

> **定理 2.1**（平面波的频域表示）：对平面波做时间 Fourier 变换，利用时移性质 $\mathcal{F}\{f(t-\tau)\} = F(\omega)e^{-j\omega\tau}$ 与 $\omega\tau_n = \mathbf{k}^T\mathbf{p}_n$，得
>
> $$
> \boxed{F(\omega, \mathbf{p}) = F(\omega)\, e^{-j\mathbf{k}^T\mathbf{p}}},
> $$
>
> 其中 $F(\omega)$ 是原点处信号的频谱。空间位置的影响浓缩为一个与方向有关的复相位因子——这是理解阵列作为空域滤波器的钥匙。

---

## 2.3 阵列的时域模型（Time-Domain Array Model）

设 $N$ 元阵列接收来自方向 $\mathbf{a}$ 的平面波，第 $n$ 个传感器输出为原点信号 $s(t)$ 延迟 $\tau_n = \mathbf{a}^T\mathbf{p}_n/c$ 后的版本：

$$
\mathbf{x}(t) =
\begin{bmatrix}
    s(t - \tau_0) \\ s(t - \tau_1) \\ \vdots \\ s(t - \tau_{N-1})
\end{bmatrix}
+ \mathbf{n}(t),
$$

其中 $\mathbf{n}(t) \in \mathbb{C}^N$ 为加性传感器噪声，通常假设零均值、空间白的复 Gauss 随机过程。存在 $D$ 个信号源（方向 $\mathbf{a}_1, \ldots, \mathbf{a}_D$）时模型直接叠加为 $\mathbf{x}(t) = \sum_{i=1}^{D}[s_i(t-\tau_0^{(i)}), \ldots, s_i(t-\tau_{N-1}^{(i)})]^T + \mathbf{n}(t)$。

此形式虽然准确，但各通道时延互不相同，难以写成紧凑代数式。§ 2.4–2.5 先在频域中建立流形向量与频率-波数响应（对所有带宽精确成立）；§ 2.6 的**窄带近似**（narrowband approximation）将时延化为相移，得到广泛应用的工作模型 $\mathbf{x}(t) = \mathbf{v}(\mathbf{k})\,s(t) + \mathbf{n}(t)$。

---

## 2.4 阵列流形向量（Array Manifold Vector）

> **定义 2.5**（阵列流形向量 / Array Manifold Vector）：给定传感器位置 $\{\mathbf{p}_n\}$ 与波数向量 $\mathbf{k}$，**阵列流形向量**（也称**导向向量**，steering vector）定义为
>
> $$
> \boxed{\mathbf{v}(\mathbf{k}) \triangleq
> \begin{bmatrix}
>     e^{-j \mathbf{k}^T \mathbf{p}_0} \\
>     e^{-j \mathbf{k}^T \mathbf{p}_1} \\
>     \vdots \\
>     e^{-j \mathbf{k}^T \mathbf{p}_{N-1}}
> \end{bmatrix}
> \in \mathbb{C}^N}.
> $$
>
> 每个分量 $e^{-j\mathbf{k}^T\mathbf{p}_n}$ 表示第 $n$ 个阵元相对原点的相位偏移。

流形向量完整刻画阵列对来自方向 $\mathbf{a}$（等价地波数 $\mathbf{k}$）的平面波的频域响应结构；当 $\mathbf{k}$ 遍取所有方向时，$\mathbf{v}(\mathbf{k})$ 在 $\mathbb{C}^N$ 中张成一个曲面，称为**阵列流形**（array manifold），其几何性质直接决定阵列的分辨能力、测向精度与模糊敏感度。

**ULA 的流形向量。** 对沿 $z$ 轴排列的 ULA（$\mathbf{p}_n = (0,0,nd)$），信号从与轴线夹角 $\theta$ 的方向入射（$\theta = 90^\circ$ 为法向 / broadside），则

$$
\mathbf{v}(\theta) = \bigl[1,\; e^{-j\frac{2\pi d}{\lambda}\cos\theta},\; \ldots,\; e^{-j(N-1)\frac{2\pi d}{\lambda}\cos\theta}\bigr]^T,
$$

这是一个 Vandermonde 向量，由相邻阵元间恒定的相位差——**阵间相移** $\Delta\phi = -\frac{2\pi d}{\lambda}\cos\theta$ 完全决定。Vandermonde 结构使 MUSIC、ESPRIT 等算法可利用该结构高效估计参数。对 $D$ 个信号源，定义**阵列流形矩阵** $\mathbf{V}(\mathbf{K}) = [\mathbf{v}(\mathbf{k}_1), \ldots, \mathbf{v}(\mathbf{k}_D)] \in \mathbb{C}^{N\times D}$，频域多信号模型为 $\mathbf{F}(\omega) = \mathbf{V}(\mathbf{K})\mathbf{S}(\omega) + \mathbf{N}(\omega)$；若 $\mathbf{V}$ 列满秩（各 $\mathbf{v}(\mathbf{k}_i)$ 线性无关），多个信号可在空间中被区分——这是所有高分辨 DOA 估计方法的前提。

---

## 2.5 频率-波数响应与波束方向图（Frequency-Wavenumber Response and Beampattern）

> **定义 2.6**（频率-波数响应函数 / Frequency-Wavenumber Response Function）：为每个传感器赋予复权重 $w_n$，记 $\mathbf{w} = [w_0, \ldots, w_{N-1}]^T \in \mathbb{C}^N$。阵列对频率 $\omega$、波数 $\mathbf{k}$ 的单位幅度平面波输入的**频率-波数响应函数**定义为
>
> $$
> \boxed{\Upsilon(\omega, \mathbf{k}) \triangleq \sum_{n=0}^{N-1} w_n^*\, e^{-j \mathbf{k}^T \mathbf{p}_n} = \mathbf{w}^H \mathbf{v}(\mathbf{k})}.
> $$
>
> $\Upsilon$ 为复标量：$|\Upsilon|$ 是幅度响应，$\arg\Upsilon$ 是相位响应。

**物理解释。** 幅度为 1、来自方向 $\mathbf{a} = (c/\omega)\mathbf{k}$ 的平面波入射时，阵列频域输出为 $Y(\omega) = \mathbf{w}^H\mathbf{F}(\omega) = \Upsilon(\omega,\mathbf{k})\,F(\omega)$——频域输出 = 输入频谱 × 与方向相关的复增益。改变 $\mathbf{w}$ 即可控制阵列对不同方向的响应，这正是**波束成形**（beamforming）的核心思想。$\Upsilon(\omega,\mathbf{k})$ 形式上就是加权传感器分布的空间 Fourier 变换（时域 DTFT 的空间类比），因此时域信号处理中关于频谱、主瓣宽度、旁瓣水平、采样定理的概念可系统迁移到空域。

> **例 2.1**（ULA 在均匀权重下的频率-波数响应）：沿 $z$ 轴 $N$ 元 ULA，均匀权重 $w_n = 1/N$，则
>
> $$
> \Upsilon(\omega, k_z) = \frac{1}{N}\sum_{n=0}^{N-1} e^{-jk_z nd}
> = \frac{1}{N}\,\frac{\sin\!\bigl(Nk_z d/2\bigr)}{\sin\!\bigl(k_z d/2\bigr)}\,
> e^{-j(N-1)k_z d/2},
> $$
>
> 其中 $k_z = \frac{2\pi}{\lambda}\cos\theta$。幅度 $|\Upsilon| = \frac{1}{N}\left|\frac{\sin(Nk_z d/2)}{\sin(k_z d/2)}\right|$ 为 **Dirichlet 核**（阵列因子），在 $k_z = 0$（法向）取得最大值 1；零点在 $k_z = 2\pi m/(Nd)$（排除分母同为零的 $m$ 为 $N$ 整数倍处——L'Hôpital 法则恢复为 1，对应栅瓣）。将 $|\Upsilon|$ 对 $\theta$ 或 $k_z$ 作图即得**波束方向图**（beampattern）。

> **定理 2.2**（阵列处理的空-时对偶性）：阵列处理与 FIR 滤波器之间存在深刻的结构对应：
>
> **表 2.2** 时域 FIR 滤波器与空域阵列的对应关系
>
> |              | 时域 FIR 滤波器         | 空域阵列                                   |
> | ------------ | ----------------------- | ------------------------------------------ |
> | 采样域       | 时间$t$               | 空间位置$\mathbf{p}_n$                   |
> | 滤波器系数   | $h[n]$                | 权重$w_n^*$                              |
> | 频率变量     | $\omega$（角频率）    | $\mathbf{k}$（波数 / 空间频率）          |
> | 频率响应     | $H(e^{j\omega})$      | $\Upsilon(\omega, \mathbf{k})$           |
> | 主瓣宽度     | $\propto 1/T$（时长） | $\propto \lambda/D$（孔径 / 波长）       |
> | 奈奎斯特条件 | $f_s \ge 2f_{\max}$   | $d \le \lambda/2$（避免空间混叠 / 栅瓣） |
> | 栅瓣（混叠） | 频谱周期重复            | 可见区域内出现额外峰值                     |

---

**波束方向图（Beampattern）。**

> **定义 2.7**（波束方向图 / Beampattern）：给定 $\mathbf{w}$ 与阵列几何，**波束方向图**是频率-波数响应在方向上的幅度（或功率）分布：
>
> $$
> B_{\text{amp}} = |\mathbf{w}^H\mathbf{v}(\mathbf{k})|, \qquad
> B_{\text{pow}} = |\mathbf{w}^H\mathbf{v}(\mathbf{k})|^2.
> $$
>
> 在平面波约束 $\|\mathbf{k}\|_2 = 2\pi/\lambda$ 下，$\mathbf{k}$ 由角度完全决定，故波束方向图通常写作角度函数 $B(\theta)$ 或 $B(\theta,\phi)$。若无特别说明，$B(\theta)$ 指功率方向图。

波束方向图与频率-波数响应的关系是：$B(\omega,\theta,\phi) = \Upsilon(\omega,\mathbf{k})\big|_{\mathbf{k}=\frac{\omega}{c}\mathbf{a}(\theta,\phi)}$——**波束方向图是频率-波数响应在可视球面上的"切片"**：在波数域设计 $\Upsilon$，在角度域观察 $B$。

一个典型波束方向图包含：**主瓣**（增益最大的波束，指向由 $\mathbf{w}$ 控制）、**旁瓣**（主瓣外的局部极大值，其相对高度称**旁瓣水平** SLL，以 dB 度量）、**零点**（增益为零的方向，用于干扰抑制）与**半功率波束宽度**（HPBW，主瓣功率降至一半处的角宽度，衡量角度分辨力）。

**ULA 的波束方向图。** $N$ 元 ULA 均匀权重下的功率方向图为 Dirichlet 核的平方：

$$
B(\theta) = \frac{1}{N^2}\left|\frac{\sin\!\bigl(\frac{N\pi d}{\lambda}\cos\theta\bigr)}{\sin\!\bigl(\frac{\pi d}{\lambda}\cos\theta\bigr)}\right|^2,
$$

零点由 $\cos\theta = m\lambda/(Nd)$（$m = \pm1, \pm2, \ldots$，排除 $N$ 的整数倍——此时为栅瓣位置）确定，$N$ 元阵列主瓣两侧各 $N-1$ 个零点。由于 $B$ 仅通过 $k_z$ 依赖方向而 $\Upsilon$ 是 $k_z$ 的周期函数（周期 $2\pi/d$），可视区域 $k_z \in [-2\pi/\lambda, 2\pi/\lambda]$ 内可能出现多个等高的周期峰——**栅瓣**（grating lobe）位于 $k_z = 2\pi m/d$，进入可视区域的条件是 $d \ge |m|\lambda$。因此无栅瓣条件为

$$
\boxed{d < \lambda};
$$

若需波束扫描，则要求更严格的条件 $d \le \lambda/2$（半波长间距）——这正是空间奈奎斯特采样定理：对空间带宽 $1/\lambda$ 的波场，空间采样频率 $1/d$ 必须至少为其两倍。

> **例 2.2**（$N=10$、$d=\lambda/2$ ULA）：零点在 $\cos\theta = \pm 0.2, \pm 0.4, \pm 0.6, \pm 0.8$（共 $N-1 = 9$ 对）；法向 HPBW $\approx 0.886\,\lambda/(Nd) \approx 10.1^\circ$；均匀加权第一旁瓣 $-13.3$ dB；$d < \lambda$ 故无栅瓣、角度估计无模糊。该阵列可在约 $10^\circ$ 角宽度内分辨两个等功率信源（瑞利限 $\approx$ HPBW）。波束方向图常以极坐标图（$\theta$ 为极角、dB 值为径向）或直角坐标图（横轴 $\theta$ 或 $u = \cos\theta$）呈现。

---

## 2.6 窄带近似（Narrowband Approximation）

§ 2.3 的时域模型各通道时延互不相同，难以紧凑表达；频域描述（§ 2.4–2.5）对所有带宽精确，但许多算法（自适应波束成形、DOA 估计）需在时域实时操作。**窄带近似**连接二者：当信号带宽远小于载波频率时，时延可在时域中近似为相移。

> **定义 2.8**（复包络 / Complex Envelope）：设实带通信号 $s_{\text{RF}}(t)$ 载频 $f_c$、带宽 $B$（$B \ll f_c$）。其**复包络** $s(t) = s_I(t) + j s_Q(t)$ 是复基带信号，满足
>
> $$
> s_{\text{RF}}(t) = \sqrt{2}\,\Re\!\bigl\{s(t)\, e^{j\omega_c t}\bigr\}
> = \sqrt{2}\bigl[s_I(t)\cos\omega_c t - s_Q(t)\sin\omega_c t\bigr],
> $$
>
> 其中 $s_I(t)$、$s_Q(t)$ 为同相（I）/正交（Q）分量，$\omega_c = 2\pi f_c$。$|s(t)|$ 为瞬时幅度，$\arg s(t)$ 为瞬时相位偏差。直观上，复包络就是"剥掉快速载波振荡 $e^{j\omega_c t}$ 后剩下的慢变部分"，故可在基带处理。窄带条件即 $s(t)$ 的变化远慢于载波：

$$
\boxed{B \ll f_c}.
$$

**窄带假设下的关键近似。** 复包络的变化尺度约为 $1/B$，而阵列上最大时延差 $\tau_{\max} \approx L/c$。窄带条件等价于 $B\cdot\tau_{\max} \ll 1$，即**在信号穿过阵列孔径的时间内复包络几乎不变**：

$$
s(t - \tau_n) \approx s(t),
$$

从而延迟信号的复包络可用未延迟者替代，时延 $\tau_n$ 的作用体现为载波上的相移 $e^{-j\omega_c\tau_n}$。

> **定理 2.3**（窄带阵列输入-输出模型）：利用 $\omega_c\tau_n = \mathbf{k}_c^T\mathbf{p}_n$（$\mathbf{k}_c = \frac{2\pi}{\lambda_c}\mathbf{a}$ 为载波波数向量），转入复基带后第 $n$ 个传感器输出为 $x_n(t) = e^{-j\mathbf{k}_c^T\mathbf{p}_n}s(t) + n_n(t)$，堆叠为向量即得
>
> $$
> \boxed{\mathbf{x}(t) = \mathbf{v}(\mathbf{k}_c)\, s(t) + \mathbf{n}(t)},
> $$
>
> 其中 $\mathbf{v}(\mathbf{k}_c)$ 正是定义 2.5 的阵列流形向量。窄带模型是频域精确关系（定理 2.1）在时域的"单频近似"：以载波处的相位结构代表整个窄带信号在所有频率上的相位行为；带宽越窄，近似越精确。

> **例 2.3**（窄带条件的数值检验）：载波 $f_c = 1$ GHz（$\lambda_c = 0.3$ m），带宽 $B = 1$ MHz，$N=10$ 元 ULA、$d = \lambda_c/2 = 0.15$ m。孔径 $L = 1.35$ m，最大时延差 $\tau_{\max} = 4.5$ ns，$B\tau_{\max} = 0.0045 \ll 1$——复包络在此期间几乎不变，窄带近似极为精确。若 $B = 100$ MHz（超宽带），$B\tau_{\max} = 0.45$，近似不再成立，必须回到 § 2.3 的全时延模型或采用宽带波束成形。

**窄带模型的意义。** 它将时延-求和模型化简为流形向量与复包络的乘积，使得：协方差矩阵具有低秩结构 $\mathbf{R}_x = \sigma_s^2\mathbf{v}\mathbf{v}^H + \sigma_n^2\mathbf{I}$（可应用特征分解类算法）；波束成形退化为复权重内积 $y(t) = \mathbf{w}^H\mathbf{x}(t)$，输出功率 $\mathbf{w}^H\mathbf{R}_x\mathbf{w}$；频率-波数响应简化为载频处的固定方向图。**本书后续所有章节除非特别说明，均默认窄带假设。**

---

## 2.7 ULA 的几何、流形与共轭对称（ULA Geometry, Manifold and Conjugate Symmetry）

考虑 $N$ 元传感器沿 $z$ 轴均匀排布、间距 $d$，坐标原点取在阵列中心，第 $n$ 个传感器的 $z$ 坐标为

$$
p_z = \Bigl(n - \frac{N-1}{2}\Bigr)d, \qquad n = 0, 1, \ldots, N-1.
$$

![图 2.2：N 元沿 z 轴排布的均匀线阵（ULA），阵元间距为 d，坐标原点位于阵列中心。](<../pic/沿%20z%20轴排布的均匀线阵%20ULA.png>)

对 ULA 仅波数沿轴线方向的分量 $k_z = -\frac{2\pi}{\lambda}\cos\theta$ 影响阵元间相位差（$\theta$ 为入射方向与 $+z$ 轴的夹角，$\theta = 90^\circ$ 为法向，$\theta = 0^\circ, 180^\circ$ 为端射）。引入 ULA 专用的归一化波数变量

$$
\boxed{\psi \triangleq -k_z d = \frac{2\pi d}{\lambda}\cos\theta},
$$

即相邻阵元间的相位差——分析 ULA 的核心变量。代入中心对称位置，流形向量为

$$
\boxed{\mathbf{v}_\psi(\psi) =
\begin{bmatrix}
    e^{j\frac{N-1}{2}\psi} \\ e^{j\frac{N-3}{2}\psi} \\ \vdots \\ e^{-j\frac{N-1}{2}\psi}
\end{bmatrix}
= e^{-j\frac{N-1}{2}\psi}\,
\begin{bmatrix}
    1 \\ e^{j\psi} \\ \vdots \\ e^{j(N-1)\psi}
\end{bmatrix}
\in \mathbb{C}^N}.
$$

令 $z \triangleq e^{j\psi}$，则各分量是同一复数 $z$ 的逐次幂——Vandermonde 向量。ULA 的全部代数性质皆源于此结构：**多信号可分辨性**（$D$ 个互异 $\psi_i$ 对应的 $N\times D$ Vandermonde 矩阵必列满秩，只要 $D \le N$）；**旋转不变性**（前后两个 $N-1$ 元子阵列流形仅差标量 $e^{j\psi}$：$\mathbf{v}_\psi^{(1:N-1)} = e^{j\psi}\mathbf{v}_\psi^{(0:N-2)}$——ESPRIT 算法无需谱搜索的数学根基）；**共轭对称性**（$\mathbf{v}_\psi(-\psi) = \mathbf{v}_\psi^*(\psi)$，见下）。可视区域为 $\psi \in [-2\pi d/\lambda,\, 2\pi d/\lambda]$：$d = \lambda/2$ 时恰为 $[-\pi,\pi]$，$\theta \mapsto \psi$ 一一对应；$d > \lambda/2$ 时超出 $[-\pi,\pi]$，因 $e^{j(\psi+2\pi)} = e^{j\psi}$ 产生栅瓣模糊。此外，$\mathbf{v}_\psi$ 仅通过 $\cos\theta$ 依赖方向，故线阵**无法区分与轴线夹角相同的两个方向**（$\theta$ 与 $-\theta$）——锥角模糊（conical ambiguity）是所有线性阵列的固有局限。

---

**共轭对称性（Conjugate Symmetry）。** 由中心对称坐标直接计算得：

> **定理 2.4**（ULA 流形向量的共轭对称性）：
>
> $$
> \boxed{\mathbf{v}_\psi(-\psi) = \mathbf{v}_\psi^*(\psi)},
> $$
>
> 将 $\psi$ 反号等同于取复共轭。用物理角度表述（$\cos(\pi-\theta) = -\cos\theta$）：$\mathbf{v}_\psi(\pi-\theta) = \mathbf{v}_\psi^*(\theta)$。因此实权重下功率方向图 $B(-\psi) = B(\psi)$，即 $B(\theta) = B(\pi-\theta)$——**波束方向图关于法向对称**，是锥角模糊在方向图上的体现。

共轭对称性在协方差矩阵上留下鲜明印记：交换矩阵 $\mathbf{J}$（反对角线全 1）反转传感器索引，满足 $\mathbf{J}\mathbf{v}_\psi(\psi) = \mathbf{v}_\psi^*(\psi)$，从而

$$
\boxed{\mathbf{R}_x = \mathbf{J}\mathbf{R}_x^*\mathbf{J}},
$$

称 $\mathbf{R}_x$ 为**中心-Hermitian**（centro-Hermitian）或**双对称**（persymmetric）矩阵。其最重要的工程应用是**前后向平均**（forward-backward averaging）：

$$
\hat{\mathbf{R}}_{\text{FB}} = \frac{1}{2}\Bigl(\hat{\mathbf{R}}_x + \mathbf{J}\hat{\mathbf{R}}_x^*\mathbf{J}\Bigr),
$$

它等效加倍快拍数（每个快拍同时提供正向与反向视角，改善有限样本下的协方差估计精度），并能**解相干**：对完全相干信号源（如多径），原始 $\mathbf{R}_x$ 的信号子空间秩亏，前后向平均可将其秩恢复至 $D$，使 MUSIC 等子空间算法对相干源仍然有效。成立前提正是中心对称的阵列几何。

---

## 2.8 可视区域（Visible Region）

电气角 $\psi = \frac{2\pi d}{\lambda}\cos\theta$ 将物理到达角 $\theta \in [0,\pi]$ 映射为实变量。

> **定义 2.9**（可视区域）：$\psi$ 在 $\theta \in [0,\pi]$（即 $\cos\theta \in [-1,1]$）下的取值范围
>
> $$
> \boxed{\psi \in \Bigl[-\frac{2\pi d}{\lambda},\, \frac{2\pi d}{\lambda}\Bigr]}
> $$
>
> 称为**可视区域**。只有落入该区间的 $\psi$ 值才对应真实的物理平面波。

流形向量 $\mathbf{v}_\psi(\psi)$ 定义在整个实轴上，但仅可视区域内的值对应物理方向；可视区域内的流形向量全体构成**阵列流形** $\mathcal{A} = \{\mathbf{v}_\psi(\psi) : \psi \in [-\frac{2\pi d}{\lambda},\frac{2\pi d}{\lambda}]\} \subset \mathbb{C}^N$。参数 $\psi$ 遍历 $\mathbb{R}$ 时流形曲线是连续螺旋，可视区域只截取其中一段弧。可视区域宽度 $4\pi d/\lambda$ 由 $d/\lambda$ 唯一决定，有三种典型情况：$d = \lambda/2$ 时恰为 $[-\pi,\pi]$，覆盖一整个 $2\pi$ 周期，最均衡；$d < \lambda/2$ 时窄于一个周期（如 $d = \lambda/4$ 时 $\psi \in [-\pi/2,\pi/2]$），流形弧段更短、波束更宽、分辨力更低；$d > \lambda/2$ 时宽于一个周期，因 $\mathbf{v}_\psi(\psi+2\pi) = \mathbf{v}_\psi(\psi)$，存在多个物理角度映射到同一流形向量——**角度模糊**（angle ambiguity），即栅瓣现象的代数量化。

> **定理 2.5**（可视区域的周期覆盖条件）：可视区域宽度 $\Psi_{\text{vis}} = 4\pi d/\lambda$。避免角度模糊的条件为
>
> $$
> \boxed{\frac{\Psi_{\text{vis}}}{2\pi} = \frac{2d}{\lambda} \le 1 \quad\Longrightarrow\quad d \le \frac{\lambda}{2}}.
> $$
>
> 即可视区域不超过流形向量的一个周期时，$\psi \leftrightarrow \theta$ 一一对应，无栅瓣。

为方便比较不同 $d/\lambda$ 值，有时按 $4\pi d/\lambda$ 归一化到 $[-1,1]$：$u \triangleq \frac{\lambda}{2\pi d}\psi = \cos\theta$——$u$ 直接就是方向余弦，与 $d/\lambda$ 无关，但抹去了间距变化带来的物理效应（栅瓣对应 $u$ 的周期性延拓），故工程中 $\psi$ 更常用。

![图 2.3：N=10 均匀加权 ULA 在不同 d/λ 下的 u 空间波束方向图（灰色带为可视区，红色虚线为栅瓣位置）。d=1.1λ 时栅瓣落入可视区，造成角度模糊。](../pic/ch2_ULA栅瓣验证_u空间对比.png)

---

## 2.9 波束赋形与均匀加权方向图（Pattern Synthesis and Uniformly Weighted Beampattern）

**波束赋形与置零（Pattern Synthesis and Null-Steering）。** 前面各节是正向问题（已知权值求波束）；本节讨论逆向问题——**预先指定 $N$ 个方向上的期望波束增益，反推权重向量 $\mathbf{w}$**，这是自适应波束成形和数字波束成形（DBF）的基本数学工具。将选定的 $N$ 个方向的导向矢量排成 $N\times N$ 流形矩阵 $\mathbf{V}(\psi) = [\mathbf{v}(\psi_1), \ldots, \mathbf{v}(\psi_N)]$，设期望增益行向量为 $\mathbf{B}_{\text{des}} = [B_1, \ldots, B_N]$，则 $\mathbf{B}_{\text{des}} = \mathbf{w}^H\mathbf{V}(\psi)$，闭式解为

$$
\boxed{\mathbf{w} = \bigl[\mathbf{V}^H(\psi)\bigr]^{-1}\,\mathbf{B}_{\text{des}}^H}.
$$

求逆要求 $\mathbf{V}$ 满秩——所选 $\psi_i$ 不能靠得太近（导向矢量近似共线时矩阵奇异），工程上一般均匀选取。最常用的特例：令 $\psi_1 = 0$（法向）期望增益为 1，其余 $N-1$ 个方向期望增益为 0，即 $\mathbf{B}_{\text{des}} = \mathbf{e}_1^T$，则 $\mathbf{w} = [\mathbf{V}^H(\psi)]^{-1}\mathbf{e}_1$（逆矩阵第一列）——波束在法向凸起主瓣，在其余 $N-1$ 个预设方向形成**精确零点**（exact nulls），彻底抑制干扰，即经典的零点约束波束成形。

**均匀加权波束方向图。** 均匀加权 $w_n = 1/N$（$1/N$ 因子保证法向入射 $\psi = 0$ 时输出归一化为 1）是"不做任何方向偏好"的基准，波束形状完全由阵列几何决定。代入中心对称 ULA 的导向矢量，利用几何级数求和并消去相位因子，得到漂亮的实数闭式——**Dirichlet 核**（阵列因子）：

$$
\boxed{B_\psi(\psi) = \frac{1}{N}\,\frac{\sin\bigl(\frac{N\psi}{2}\bigr)}{\sin\bigl(\frac{\psi}{2}\bigr)}},
\qquad
B_u(u) = \frac{1}{N}\,\frac{\sin\bigl(\frac{\pi Nd}{\lambda}u\bigr)}{\sin\bigl(\frac{\pi d}{\lambda}u\bigr)},
$$

$\psi$ 空间适合理论分析（揭示 Vandermonde 结构），$u = \cos\theta$ 空间适合工程直观。Dirichlet 核的性质（主瓣峰值 1、零点位置、旁瓣电平、周期性、栅瓣）与 § 2.10 七大参数直接对应，详见下节。

---

## 2.10 波束方向图的七大关键参数（Seven Key Beam Pattern Parameters）

均匀加权 ULA 的方向图 $B_u(u)$ 是完全由 $N$ 和 $d/\lambda$ 决定的解析函数，评估其性能需要定量指标体系（原书 2.4.1 节）。七个关键参数如下：

1. **3-dB 波束宽度（HPBW）**：主瓣功率下降到峰值一半处的宽度。$u$ 空间近似解为
   $$
   \Delta u_1 \approx 0.891\,\frac{\lambda}{Nd} \quad (N > 10),\qquad 0.886\,\frac{\lambda}{Nd} \quad (N > 30).
   $$
   HPBW 是角度分辨力的首要指标。
2. **零点-零点宽度（BW$\text{NN}$）**：第一零点位于 $u = \lambda/(Nd)$，故 $\Delta u_2 = 2\lambda/(Nd) \triangleq \text{BW}_{\text{NN}}$。其一半 $0.5\,\text{BW}_{\text{NN}}$ 就是经典的 **Rayleigh 分辨极限**：两个等幅平面波被认为"可分辨"，当且仅当第二个波束峰值落在第一个波束的第一零点（或更远）。
3. **第一旁瓣位置**：旁瓣峰值近似在分子 $|\sin(\pi Ndu/\lambda)|$ 最大处，第一旁瓣位于 $u \approx \pm 3\lambda/(2Nd)$（$\psi \approx \pm 3\pi/N$）。
4. **第一旁瓣高度**：小角度近似下 $|B_u(u_{\text{sl1}})| \approx 2/(3\pi)$，即
   $$
   \boxed{\text{第一旁瓣电平} \approx 20\log_{10}(2/3\pi) \approx -13.5\ \text{dB}}.
   $$
   这意味着比目标强 $13.5$ dB 的干扰若落在旁瓣峰值处，将产生与主瓣相同的输出——旁瓣控制问题是确定性波束设计（第 3 章）与自适应波束设计（第 7 章）的核心驱动力。
5. **其余零点位置**：第 $m$ 个零点在 $u_m = m\lambda/(Nd)$（$m$ 为 $N$ 整数倍时分子分母同时为零，恢复为栅瓣峰值 1）。相邻零点均匀间隔 $\lambda/(Nd)$，零点密度随 $N$ 线性增加。
6. **旁瓣衰减速率**：各旁瓣高度按 $|B_u(u_{\text{sl},m})| \approx 2/[(2m+1)\pi]$ 下降，第 2 旁瓣 $-17.9$ dB、第 3 旁瓣 $-20.8$ dB……每倍程约 $-6$ dB/oct，衰减缓慢——工程中几乎总用锥削（taper）加速衰减。
7. **栅瓣（Grating Lobes）**：分子分母同时为零时由 L'Hôpital 法则恢复为主瓣高度 1——与主瓣完全等高的寄生波束。栅瓣在 $u = m\lambda/d$，落入可视区的条件为 $d > \lambda$（法向固定时）；带波束扫描时要求 $d \le \lambda/2$。栅瓣与时域欠采样造成的频谱混叠（aliasing）本质一致。

**表 2.3** $N$ 元半波长间距均匀加权 ULA 的方向图七大参数一览

| 参数（Parameter）    | 公式（Formula）                          | 典型值（$N=10$）                          |
| -------------------- | ---------------------------------------- | ------------------------------------------- |
| 3-dB 波束宽度 / HPBW | $\Delta u_1 \approx 0.891\lambda/(Nd)$ | ~0.178 ($\approx 10.2^\circ$ @ broadside) |
| 零点-零点宽度 / BWNN | $\Delta u_2 = 2\lambda/(Nd)$           | $0.4$                                     |
| 第一旁瓣位置         | $u \approx 3\lambda/(2Nd)$             | $0.3$                                     |
| 第一旁瓣高度         | $\approx -13.5$ dB                     | $-13.5$ dB                                |
| 第$m$ 零点         | $u_m = m\lambda/(Nd)$                  | $0.2, 0.4, 0.6, \ldots$                   |
| 旁瓣衰减             | $\sim 1/(2m+1)$                        | $-17.9, -20.8, -22.9\ldots$ dB            |
| 栅瓣位置             | $u = m\lambda/d$                       | $u = \pm 2, \pm 4, \ldots$（不可视）      |

![图 2.4：N=10、d=1.1λ 时的角度模糊演示。左：θ 空间，栅瓣导致多个角度产生相同增益；右：u 空间，第一栅瓣 u=±0.91 已落入可视区 [-1,1] 内（红色虚线），与主瓣等高，造成方向不可区分。](../pic/ch2_ULA栅瓣验证_角度模糊演示.png)

---

## 2.11 阵列电子扫描（Array Electronic Scanning）

前文主要讨论法向（broadside）波束。雷达、声纳与通信系统通常需要将波束指向任意期望方向以搜索、跟踪或对准目标。**电子扫描**（electronic scanning）通过在阵元通道中插入可控相移实现波束偏转，无需机械转动——这正是相控阵（phased array）名称的由来。

### 2.11.1 扫描的数学机理

要使阵列在目标方向 $\theta_T$（$\psi_T = \frac{2\pi d}{\lambda}\cos\theta_T$）产生最大增益，直觉是让权重向量与流形向量匹配——各阵元的复权重恰好补偿传播引入的相位差。

> **定义 2.10**（扫描权重向量 / Scanning Weight Vector）：取权重向量为归一化的流形向量
>
> $$
> \boxed{\mathbf{w}_c = \frac{\mathbf{v}(\psi_T)}{N}},
> $$
>
> 即 $w_n = \frac{1}{N}e^{-j n\psi_T}$（以首阵元为参考）。该权重称为**常规波束成形**（conventional beamforming）或**延迟求和**（delay-and-sum）权重。

代入频率-波数响应得**扫描波束方向图**——Dirichlet 核的平移版本，主瓣从 $\psi = 0$ 移到 $\psi = \psi_T$，形状不变：

$$
\boxed{B_\psi(\psi;\psi_T) = \frac{1}{N}\,\frac{\sin\!\bigl(\frac{N(\psi-\psi_T)}{2}\bigr)}{\sin\!\bigl(\frac{\psi-\psi_T}{2}\bigr)}},
\qquad
B_u(u;u_T) = \frac{1}{N}\,\frac{\sin\!\bigl(\frac{\pi Nd}{\lambda}(u-u_T)\bigr)}{\sin\!\bigl(\frac{\pi d}{\lambda}(u-u_T)\bigr)}.
$$

**物理解释。** 权重在每通道插入相移 $-n\psi_T$；当信号来自 $\theta_T$ 时，传播引入的阵间相移 $+\psi_T$ 恰好被抵消，各通道同相相加（coherent combining）输出最大；来自其他方向的信号因相位不匹配被抑制——空域匹配滤波（spatial matched filter）的思想。

> **定理 2.6**（电子扫描的相位补偿原理）：设来自 $\theta_T$ 的信号在第 $n$ 个阵元的传播相位为 $-n\psi_T$，扫描权重提供补偿相位 $+n\psi_T$，则加权输出
>
> $$
> y(t) = \frac{1}{N}\sum_{n=0}^{N-1} e^{+j n\psi_T} e^{-j n\psi_T} s(t) = s(t),
> $$
>
> 信号无失真通过。在波数域中，扫描等价于响应平移：$\Upsilon_{\text{scan}}(\omega,\mathbf{k}) = \Upsilon(\omega,\mathbf{k}-\mathbf{k}_T)$——扫描只是坐标原点的平移。

> **例 2.4**（$N=10$、$d = \lambda/2$，$\theta_T = 60^\circ$）：$\psi_T = \pi\cos 60^\circ = 0.5\pi$，权重 $w_n = \frac{1}{10}e^{-j0.5\pi n}$，波束峰值从法向移至 $\theta = 60^\circ$。注意锥角模糊：波束同时在 $\theta = 120^\circ$（$\psi = -0.5\pi$）产生对称峰值——线阵固有特性。

### 2.11.2 扫描波束展宽效应（Scan Beam Broadening）

波束偏离法向时 HPBW 展宽，且不能通过增加阵元数消除——这是阵列几何的本质特征。

> **定义 2.11**（扫描波束展宽 / Scan Beam Broadening）：波束从法向扫描到 $\theta_T$ 时，有效孔径从 $L$ 缩小为投影 $L\sin\theta_T$，角度分辨率按 $1/\sin\theta_T$ 退化：
>
> $$
> \boxed{\Delta\theta(\theta_T) \approx \frac{\Delta\theta(90^\circ)}{\sin\theta_T}}.
> $$

**推导。** 法向 HPBW 在 $u$ 空间为 $\Delta u \approx 0.886\lambda/(Nd)$，由微分关系 $\mathrm{d}u = -\sin\theta\,\mathrm{d}\theta$ 得 $\Delta\theta \approx \Delta u/|\sin\theta_T|$。$\theta_T \to 90^\circ$ 时 HPBW 最小；$\theta_T \to 0^\circ$ 或 $180^\circ$（端射）时 $\sin\theta_T \to 0$，HPBW $\to \infty$——波束完全发散。以 $N=10$、$d=\lambda/2$ 为例：

**表 2.4** 扫描角 $\theta_T$ 与波束展宽倍数的数值关系（$N=10$, $d=\lambda/2$）

| 扫描角$\theta_T$   | $\sin\theta_T$ | HPBW（$\Delta\theta$） | 展宽倍数       |
| -------------------- | ---------------- | ------------------------ | -------------- |
| $90^\circ$（法向） | $1.00$         | $\approx 10.2^\circ$   | $1.00\times$ |
| $60^\circ$         | $0.87$         | $\approx 11.8^\circ$   | $1.15\times$ |
| $45^\circ$         | $0.71$         | $\approx 14.4^\circ$   | $1.41\times$ |
| $30^\circ$         | $0.50$         | $\approx 20.4^\circ$   | $2.00\times$ |
| $15^\circ$         | $0.26$         | $\approx 39.4^\circ$   | $3.86\times$ |

扫描到 $30^\circ$ 时波束已展宽至两倍——这是工程中相控阵通常将扫描范围限制在相对法向 $\pm 60^\circ$ 以内的重要原因之一。

> **定理 2.7**（扫描展宽的物理根源）：展宽的本质是**有效孔径投影效应**：信号沿 $\theta_T$ 到达时，阵列在波前平面上的投影长度为 $L_{\text{eff}} = L\sin\theta_T$，而波束宽度反比于有效孔径，故 $\Delta\theta \propto \lambda/L_{\text{eff}}$。这与光学中倾斜光栅导致分辨力下降的原理相同。

### 2.11.3 端射阵列（Endfire Array）

> **定义 2.12**（端射阵列 / Endfire Array）：**端射阵列**指主波束指向阵列轴线方向（$\theta_T = 0^\circ$ 或 $180^\circ$）的线阵；对应的法向波束称为**侧射**（broadside）。

端射波束的特征：$\theta_T \to 0^\circ$ 时 $\sin\theta_T \to 0$，HPBW $\to \infty$，角分辨率远逊于法向（物理限制，无法用阵元数弥补）；在 $u$ 空间端射扫描（$u_T = 1$）与法向扫描的 Dirichlet 核形状完全相同（仅平移），$\theta$ 空间的展宽完全来自 $u = \cos\theta$ 在端射附近的非线性映射（$\cos\theta$ 在 $\theta = 0^\circ$ 处导数为零）；$\theta$ 空间中端射波束极不对称——朝阵列外侧有明确主瓣，朝内侧逐渐发散；锥角模糊集中在端射附近（$\theta \approx 0^\circ$ 与 $-\theta \approx 0^\circ$ 几乎重合），方向估计极度不可靠。

> **例 2.5**（端射与法向的对比）：$N=10$、$d = \lambda/2$。法向波束 HPBW $\approx 10.2^\circ$，波束对称，$\theta$ 与 $u$ 空间映射近似线性；端射波束在 $\theta$ 空间极宽（数十度）、极不对称，但 $u$ 空间仍为标准 Dirichlet 核（峰值位于 $u_T = 1$），HPBW 仍为 $\Delta u \approx 0.178$，只是映射到 $\theta$ 空间后被剧烈拉伸。

端射阵列在部分场景仍有价值（如机翼前缘共形天线天然只能端射工作）。改善手段有 **Hansen-Woodyard 条件**（在常规相移外叠加额外相位压缩波束，形成超方向性 / superdirectivity，但旁瓣显著升高、容差极度敏感）与**增大孔径**（更多阵元或非均匀间距提升端射方向有效孔径）。

### 2.11.4 栅瓣扫描约束（Grating Lobe Scan Constraints）

§ 2.5 讨论的法向栅瓣条件 $d < \lambda$ 在波束扫描时不再足够——扫描使无栅瓣的间距要求更严格。

> **定义 2.13**（扫描阵列的无栅瓣条件）：波束扫描至 $u_T = \cos\theta_T$ 时，第 $m$ 个栅瓣位于 $u = u_T + m\lambda/d$。最近栅瓣（$m = \pm 1$）不落入可视区 $[-1,1]$ 的要求为
>
> $$
> \boxed{\frac{d}{\lambda} \le \frac{1}{1 + |\cos\theta_T|} = \frac{1}{1 + |u_T|}}.
> $$

**推导。** 主瓣在 $u_T$，两个最近栅瓣在 $u_T \pm \lambda/d$。右侧栅瓣区外要求 $\frac{d}{\lambda} < \frac{1}{1-u_T}$，左侧要求 $\frac{d}{\lambda} < \frac{1}{1+u_T}$，取更严格者即 $\frac{1}{1+|u_T|}$。

**表 2.5** 不同扫描角 $\theta_T$ 下无栅瓣扫描的最大允许阵元间距 $d/\lambda$

| 扫描角$\theta_T$   | $\vert u_T\vert = \vert\cos\theta_T\vert$ | 最大允许$d/\lambda$ | 条件                |
| -------------------- | ------------------------------------------- | --------------------- | ------------------- |
| $90^\circ$（法向） | $0$                                       | $1.00$              | $d < \lambda$     |
| $60^\circ$         | $0.5$                                     | $0.67$              | $d < 0.67\lambda$ |
| $45^\circ$         | $0.71$                                    | $0.59$              | $d < 0.59\lambda$ |
| $30^\circ$         | $0.87$                                    | $0.54$              | $d < 0.54\lambda$ |
| $0^\circ$（端射）  | $1$                                       | $0.50$              | $d \le \lambda/2$ |

**最坏情况——端射扫描**使条件退化为 $d \le \lambda/2$：半波长间距保证从法向到端射的全扫描范围无栅瓣——这是"带波束扫描时需 $d \le \lambda/2$"的严格推导。

**设计启示。** 扫描范围决定阵元间距：若仅需在法向附近 $\pm 30^\circ$ 内扫描（$|u_T| \le 0.5$），$d \le 0.67\lambda$ 即可，比半波长宽松 33%，允许更大的物理孔径与更窄的法向波束；宽带系统中 $d/\lambda$ 随频率变化，间距设计需在最高频处满足扫描栅瓣约束；增大 $d$ 超过 $\lambda/2$ 可换取更窄法向波束，但牺牲扫描范围。

> **例 2.6**（扫描栅瓣验证）：$N=10$、$d = 0.7\lambda$。法向波束安全（第一栅瓣 $u = \pm 1.43$ 在区外）；扫描至 $\theta_T = 60^\circ$（$u_T = 0.5$）时允许 $d/\lambda \le 0.67$，但 $0.7 > 0.67$——左侧栅瓣 $u_T - \lambda/d = -0.93$ 已落入可视区，来自 $\theta \approx 158^\circ$ 的信号将与 $\theta = 60^\circ$ 的目标产生相同响应，测角严重模糊；扫描至 $45^\circ$ 时两个栅瓣均进入可视区。结论：$d = 0.7\lambda$ 的阵列扫描超过约 $\cos^{-1}(1 - \lambda/d) \approx 48^\circ$ 后出现栅瓣，扫描范围被严重限制。

**与空间奈奎斯特采样的统一。** 扫描等价于空间频率上的频移——信号空间频率"中心"变为 $u_T/\lambda$，但空间带宽不变（仍为 $2/\lambda$），奈奎斯特条件不变。**一句话总结：无论波束指向何方，要保证全扫描范围无栅瓣模糊，必须满足 $d \le \lambda/2$——这是空间奈奎斯特采样定理对相控阵的硬性约束。**

---

## 2.12 阵列性能度量（Array Performance Measures）

七大参数从几何细节刻画波束形状，但工程上还需要更宏观的标量指标回答三个问题：阵列把能量集中在目标方向的能力有多强（**方向性**）？阵列对噪声的抑制带来多少信噪比增益（**白噪声阵列增益**）？阵元误差对波束性能的影响有多大（**敏感度函数**）？

### 2.12.1 方向性（Directivity）

> **定义 2.14**（方向性 / Directivity）：**方向性**定义为主瓣方向辐射强度与所有方向平均辐射强度的比值：
>
> $$
> \boxed{D = \frac{P(\theta_T, \phi_T)}{\displaystyle\frac{1}{4\pi}\int_0^\pi\!\!\int_0^{2\pi} P(\theta, \phi)\,\sin\theta\,\mathrm{d}\theta\,\mathrm{d}\phi}},
> $$
>
> 其中 $P(\theta,\phi) \propto |B(\theta,\phi)|^2$，$(\theta_T,\phi_T)$ 为主瓣指向。全向阵元的方向性为 1。工程中常用对数形式**方向性指数** $DI \triangleq 10\log_{10}D$（dB）。

方向性刻画能量聚焦程度：波束越窄，$D$ 越高。定义**波束立体角** $\Omega_A \triangleq \iint_{4\pi}|B|^2\,\mathrm{d}\Omega/|B_{\max}|^2$，则峰值方向的方向性恰为 $D_{\max} = 4\pi/\Omega_A$——若以主瓣增益均匀覆盖整个立体角 $4\pi$，等效覆盖范围就是 $\Omega_A$。

> **定理 2.8**（标准线阵的方向性，$d = \lambda/2$）：对 $N$ 元半波长标准线阵，
>
> $$
> \boxed{D = \frac{1}{\displaystyle\sum_{n=0}^{N-1} |w_n|^2} = \frac{1}{\|\mathbf{w}\|^2}}.
> $$
>
> 均匀加权 $w_n = 1/N$ 时 $\|\mathbf{w}\|^2 = 1/N$，故 $D = N$。由 Cauchy–Schwarz 不等式，均匀加权使 $D$ 达到**全局最大值**——**均匀加权使方向性最大**。直觉：$D = N$ 意味着半波长线阵在峰值方向把功率集中的程度等效于 $N$ 个全向阵元独立工作的 $N$ 倍，与时域"观测时长越长、频谱分辨力越高"的对称关系一致。

对均匀加权、$d \le \lambda/2$ 的 ULA，方向性近似为 $D \approx 2Nd/\lambda$（$d = \lambda/2$ 时退化为精确的 $D = N$）。$d > \lambda/2$ 时栅瓣进入可视区、能量被分散，方向性不再按此增长；端射方向波束极宽，方向性显著低于法向。方向性只依赖波束形状，与噪声是否相关无关——纯几何量。

> **例 2.7**（$N=10$、$d = \lambda/2$）：均匀加权 $D = 1/\|\mathbf{w}\|^2 = 10$（$DI = 10$ dB），数值积分验证一致；若 $d = \lambda/4$，$D \approx 2Nd/\lambda = 5$（$DI = 7$ dB）——间距减半、方向性减半。

### 2.12.2 白噪声阵列增益（Array Gain vs. Spatially White Noise）

方向性是纯几何量。工程上更关心：**用阵列代替单个阵元，信噪比能改善多少？**

> **定义 2.15**（白噪声阵列增益 / Array Gain vs. Spatially White Noise）：设单阵元输入信噪比 $\text{SNR}_{\text{in}}$，波束成形输出信噪比 $\text{SNR}_{\text{out}}$（指向 $(\theta_0,\phi_0)$），**白噪声阵列增益**定义为
>
> $$
> \boxed{A_w(\theta_0,\phi_0) \triangleq \frac{\text{SNR}_{\text{out}}}{\text{SNR}_{\text{in}}}}.
> $$

**推导。** 窄带模型 $\mathbf{x} = \mathbf{v}s + \mathbf{n}$，噪声空间白（$\mathbb{E}[\mathbf{n}\mathbf{n}^H] = \sigma_n^2\mathbf{I}$）。单阵元输入 SNR 为 $\sigma_s^2/\sigma_n^2$；输出信号功率 $\sigma_s^2|\mathbf{w}^H\mathbf{v}|^2$、噪声功率 $\sigma_n^2\|\mathbf{w}\|^2$，故

$$
\boxed{A_w = \frac{|\mathbf{w}^H \mathbf{v}(\theta_0,\phi_0)|^2}{\|\mathbf{w}\|^2}},
$$

响应归一化（$\mathbf{w}^H\mathbf{v} = 1$）下恰为 $A_w = 1/\|\mathbf{w}\|^2$，与方向性形式完全一致。

> **定理 2.9**（白噪声阵列增益的两个基本性质）：均匀加权（$\mathbf{w} = \mathbf{v}/N$）时 $\|\mathbf{w}\|^2 = 1/N$，故 $A_w = N$；对任意权重，由 Cauchy–Schwarz 不等式 $|\mathbf{w}^H\mathbf{v}| \le \|\mathbf{w}\|\|\mathbf{v}\| = \sqrt{N}\|\mathbf{w}\|$（流形向量满足 $\|\mathbf{v}\| = \sqrt{N}$），得 $A_w \le N$，等号当且仅当 $\mathbf{w} \propto \mathbf{v}$——**均匀加权使白噪声阵列增益最大**。

**物理意义。** 阵列通过相干累加信号、非相干累加噪声带来 SNR 改善：

**表 2.6** 信号与空间白噪声在阵列中的叠加方式对比

| 量         | 叠加方式       | 功率放大 |
| ---------- | -------------- | -------- |
| 信号       | 相干（同相）   | $N^2$  |
| 白噪声     | 非相干（独立） | $N$    |
| 信噪比增益 |                | $N$    |

> **例 2.8**（$N=10$ 标准线阵）：$A_w = N = 10$（10 dB）。又因标准线阵 $A_w = D$，方向性与增益数值相等，但来源不同：前者来自波束窄化，后者来自噪声非相干平均。

### 2.12.3 敏感度函数（Sensitivity Function）

前两个度量假设阵元完美无误差。实际阵列存在**增益误差**、**相位误差**与**位置误差**（放大器漂移、线缆相位误差、互耦不一致等），在方向图上产生一个与 $\|\mathbf{w}\|^2$ 成正比的**基底**（pedestal），抬高原本为零的响应。**敏感度函数**度量波束对这类误差的敏感程度。

> **定义 2.16**（敏感度函数 / Sensitivity Function）：设各阵元增益存在零均值、相互独立的随机误差（方差 $\sigma_e^2$），响应归一化下输出中误差贡献的功率与 $\sigma_e^2\sum_n|w_n|^2$ 成正比。定义
>
> $$
> \boxed{T_{se}(\mathbf{w}) \triangleq \sum_{n=0}^{N-1} |w_n|^2 = \|\mathbf{w}\|^2 = \frac{1}{A_w}},
> $$
>
> $T_{se}$ 越小，波束越鲁棒。其倒数恰为白噪声阵列增益 $A_w$。

均匀权重下 $T_{se} = 1/N$，由 Cauchy–Schwarz 不等式这是全局最小值——**均匀权重对抗阵元误差最鲁棒**。同一个 $\|\mathbf{w}\|^2 = 1/N$ 同时给出最大的方向性、最大的增益与最小的敏感度。三大核心量由此通过 $\|\mathbf{w}\|^2$ 连为一体：

**表 2.7** 三大核心量通过 $\|\mathbf{w}\|^{2}$ 联系在一起

| 量                    | 表达式                  | 物理意义       |
| --------------------- | ----------------------- | -------------- |
| 方向性$D$           | $\|\mathbf{w}\|^{-2}$ | 能量聚焦程度   |
| 白噪声阵列增益$A_w$ | $\|\mathbf{w}\|^{-2}$ | SNR 改善       |
| 敏感度函数$T_{se}$  | $\|\mathbf{w}\|^{2}$  | 对误差的敏感度 |

$D = A_w = 1/T_{se}$：方向性与增益是同一枚硬币的两面（能量聚焦等价于 SNR 改善），敏感度则是其倒数——性能提升与鲁棒性损失天然此消彼长。

> **定理 2.10**（锥削与鲁棒性的权衡）：任何非均匀加权（锥削，taper）——如为压低旁瓣采用的 Chebyshev、Taylor 或 Hann 锥削——都会使 $T_{se} = \|\mathbf{w}\|^2$ 增大，降低波束对阵元误差的鲁棒性：幅度锥削（如 Hann）使 $T_{se}$ 从 $1/N$ 增大（$N=10$ 时从 $0.100$ 增至约 $0.167$）；含负权重（如 Chebyshev）时权重相位分散，$\|\mathbf{w}\|^2$ 进一步增大。**压低旁瓣与保持鲁棒性不可兼得**：均匀权重鲁棒性最优但旁瓣仅 $-13.3$ dB；强锥削可把旁瓣压到 $-40$ dB 以下，却以敏感度恶化为代价。

> **例 2.9**（$N=10$：均匀与 Hann 锥削的敏感度对比）：
>
> **表 2.8** 均匀权重与 Hann 锥削的敏感度、方向性对比（$N=10$）
>
> | 权重方案            | 敏感度$T_{se} = \|\mathbf{w}\|^2$ | 方向性/增益$D = A_w$ |
> | ------------------- | ----------------------------------- | ---------------------- |
> | 均匀$w_n = 1/N$   | $0.100$（最小）                   | $10.0$（最大）       |
> | Hann 锥削（归一化） | $\approx 0.167$                   | $\approx 6.0$        |
>
> Hann 锥削把第一旁瓣从 $-13.3$ dB 压到约 $-31.5$ dB，但敏感度恶化 $67\%$、方向性损失约 $2.2$ dB——在阵元误差较大的系统中，这种鲁棒性损失可能抵消旁瓣压低带来的收益。

---

## 2.13 连续线性孔径与孔径采样（Linear Apertures and Aperture Sampling）

§ 2.1 建立了孔径的一般概念。本节深入孔径的连续形式——**连续线性孔径**（continuous linear aperture），建立其**孔径频率-波数响应**，并给出从连续孔径到离散 ULA 的**孔径采样理论**（aperture sampling theory），揭示均匀线阵与连续孔径之间深刻的数学联系。

### 2.13.1 连续线性孔径（Continuous Linear Aperture）

考虑沿 $z$ 轴跨越区间 $z \in [-L/2,\, L/2]$ 的连续线性孔径，用**孔径函数** $w(z)$ 描述位置 $z$ 处的加权系数（对应离散阵列的权重 $w_n$）。位置 $z$ 处信号相对原点的时延为 $\tau(z) = z\cos\theta/c$（$\mathbf{p}(z) = (0,0,z)$）。

> **定义 2.17**（连续线性孔径 / Continuous Linear Aperture）：沿 $z$ 轴区间 $[-L/2,\, L/2]$ 连续分布的接收孔径，由孔径函数 $w(z)$ 加权，其对来自方向 $\theta$ 的平面波的输出为孔径上的积分
>
> $$
> \boxed{y(t) = \int_{-L/2}^{L/2} w(z)\, f\!\left(t - \frac{z\cos\theta}{c}\right) \mathrm{d}z},
> $$
>
> 其中 $f(t)$ 为原点处接收信号。离散阵列（§ 2.1）是此积分的空间采样近似。

### 2.13.2 孔径频率-波数响应（Aperture Frequency-Wavenumber Response）

对连续孔径输出做时间 Fourier 变换，利用时延-波数关系 $\omega\tau = k_z z$（$k_z = \frac{2\pi}{\lambda}\cos\theta$），得 $Y(\omega) = F(\omega)\int_{-L/2}^{L/2} w(z)e^{-jk_z z}\,\mathrm{d}z$。

> **定义 2.18**（孔径频率-波数响应）：连续线性孔径的**孔径频率-波数响应**定义为孔径函数 $w(z)$ 的空间 Fourier 变换：
>
> $$
> \boxed{W(k_z) \triangleq \int_{-\infty}^{\infty} w(z)\, e^{-j k_z z}\,\mathrm{d}z}
> \qquad (w(z) \text{ 在孔径外为零}),
> $$
>
> 频域输出恰为 $Y(\omega) = W(k_z)\,F(\omega)$——与离散阵列的频率-波数响应 $\Upsilon = \mathbf{w}^H\mathbf{v}(\mathbf{k})$（定义 2.6）完全同构：求和变积分，权重向量变孔径函数。

> **定理 2.11**（均匀孔径的响应）：均匀孔径 $w(z) = 1/L$（$z \in [-L/2,L/2]$，归一化）的响应为 sinc 型函数
>
> $$
> \boxed{W(k_z) = \frac{\sin(k_z L/2)}{k_z L/2} = \operatorname{sinc}\!\Bigl(\frac{k_z L}{2\pi}\Bigr)},
> $$
>
> 主瓣峰值 1 位于 $k_z = 0$（法向），第一零点位于 $k_z = \pm 2\pi/L$。这是离散 ULA 的 Dirichlet 核（§ 2.9）的连续极限：$L = Nd$、$N \to \infty$ 时 Dirichlet 核收敛到 sinc。第一零点间距 $\Delta k_z = 4\pi/L$ 换算到 $u$ 空间为 $\Delta u \approx 2\lambda/L$，与 § 2.10 离散阵列的 $\Delta u_2 = 2\lambda/(Nd)$（$Nd \approx L$）完全一致——**连续孔径与离散 ULA 的主瓣结构在 $L$ 相同时一致**。

### 2.13.3 孔径采样理论（Aperture Sampling Theory）

实际阵列是离散的。用 $N$ 个传感器在 $z_n = (n - \frac{N-1}{2})d$ 处对连续孔径函数采样，得离散权重 $w_n = w(z_n)$（幅度锥削正是对孔径函数幅度的离散采样）。采样后的离散化响应为

$$
W_s(k_z) = \sum_{n=0}^{N-1} w_n\, e^{-j k_z z_n},
$$

即定义 2.6 的离散频率-波数响应（均匀采样时退化为 Dirichlet 核）。

> **定理 2.12**（孔径采样定理 / Aperture Sampling Theorem）：以间距 $d$ 对孔径函数采样，等价于在波数域将连续孔径响应**周期延拓**：
>
> $$
> \boxed{W_s(k_z) = \frac{1}{d} \sum_{m=-\infty}^{\infty} W\!\left(k_z - \frac{2\pi m}{d}\right)},
> $$
>
> 延拓周期 $2\pi/d$ 正是离散流形向量的固有周期（§ 2.8）。当且仅当采样间距满足空间 Nyquist 条件 $d \le \lambda/2$ 时，可视区域 $[-2\pi/\lambda,\, 2\pi/\lambda]$ 内恰好只包含一个延拓周期（$m = 0$），孔径响应无混叠——**空间域的采样定理**：对空间带宽为 $1/\lambda$ 的波场，采样频率 $1/d$ 必须至少为其两倍。

**与栅瓣的统一。** 延拓副本 $W(k_z - 2\pi m/d)$ 的峰位于 $k_z = 2\pi m/d$，恰是 § 2.5 的栅瓣位置（$u = m\lambda/d$）。$d > \lambda/2$ 时 $m = \pm 1$ 的副本主瓣进入可视区——混叠的物理表现正是栅瓣。因此：**孔径采样定理、空间 Nyquist 条件（§ 2.11.4）与栅瓣判据（§ 2.5）是同一件事的三种表述**。

> **例 2.10**（采样孔径与连续孔径的对比）：设孔径长度 $L = 4.5\lambda$：连续均匀孔径 $W(k_z) = \operatorname{sinc}(k_z L/2\pi)$，主瓣零点间距 $\Delta u = 2\lambda/L \approx 0.44$；离散采样（$N=10$、$d = \lambda/2$、$L = 4.5\lambda$）零点间距 $\Delta u_2 = 2\lambda/(Nd) = 0.40$——两者近似一致（$Nd$ 与 $L$ 差一个 $d$）；增大采样间距（$N=5$、$d = \lambda$、$L = 4\lambda$）时延拓周期减半，第一栅瓣 $m = \pm 1$ 的峰位于 $u = \pm 1$——恰好落在可视区边界（§ 2.11.4 表 2.5 的临界情形）。**结论：采样间距越大，延拓副本越靠近可视区；只有 $d \le \lambda/2$ 才能保证全扫描范围无混叠（栅瓣）。**

---

## 2.14 非各向同性阵元与方向图乘积定理（Non-Isotropic Element Patterns and Pattern Multiplication）

§ 2.1–2.13 的分析始终假设阵元**各向同性**（isotropic）——阵元本身对入射方向没有选择性。实际系统中，单个阵元（偶极子、贴片、喇叭等）通常具有自己的方向图；在大型阵列中，若干传感器还常被组合成**子阵**（subarray）整体带有方向图，子阵在整体阵列中被当作"阵元"处理。把这些阵元方向图纳入阵列分析的统一工具是**方向图乘积定理**（pattern multiplication）。

**阵元为线性孔径的模型。** 原书从最简单的情形出发：每个阵元是一个**线性孔径**（§ 2.13），具有相同的加权函数 $w_{ae}^*(z)$（下标 $ae$ 表示 element aperture）。这些阵元配置在位置 $z_n$（$n = 0, 1, \ldots, N-1$）处构成线阵——**间距不必均匀**。阵列对第 $n$ 个阵元的复权重为 $w_n^*$。整个阵列的总加权函数为各阵元孔径函数平移到 $z_n$ 处、乘以阵列权重后求和：

$$
w_t(z) = \sum_{n=0}^{N-1} w_n^*\, w_{ae}^*(z - z_n).
$$

这个平移-求和结构（形式上如同离散-连续卷积）是下面乘积分解的代数根源。

> **定义 2.19**（阵元方向图 / Element Pattern）：阵元作为独立接收单元时自身的频率-波数响应（或波束方向图），记为 $B_{\text{el}}(\theta, \phi)$ 或 $\Upsilon_{\text{el}}(\mathbf{k})$。各向同性阵元的方向图为全向单位响应；有向阵元（偶极子、贴片等）的方向图在部分方向增益低甚至为零。全阵列由相同阵元构成时，各阵元方向图相同。

> **定理 2.13**（方向图乘积定理 / Pattern Multiplication Theorem）：在"每个阵元为相同的线性孔径、间距任意"的模型下，阵列的总频率-波数响应分解为**阵列因子**（array factor）与**阵元频率-波数函数**（element frequency-wavenumber function）的乘积：
>
> $$
> \boxed{\Upsilon(\omega, k_z) = \Upsilon_{\text{AF}}(k_z)\, \Upsilon_{\text{el}}(k_z)},
> $$
>
> 其中
>
> $$
> \boxed{\Upsilon_{\text{AF}}(k_z) \triangleq \sum_{n=0}^{N-1} w_n^*\, e^{-j k_z z_n}}
> \qquad\text{（阵列因子 / array factor）},
> $$
>
> $$
> \boxed{\Upsilon_{\text{el}}(k_z) \triangleq \int_{-\infty}^{\infty} w_{ae}^*(z)\, e^{-j k_z z}\,\mathrm{d}z}
> \qquad\text{（阵元频率-波数函数）}.
> $$
>
> 阵列因子 $\Upsilon_{\text{AF}}$ 正是定义 2.6 的各向同性阵元阵列的频率-波数响应（原书式 (2.58)）——与阵元方向图无关，只由阵列几何与权重决定；阵元频率-波数函数 $\Upsilon_{\text{el}}$ 是阵元孔径函数 $w_{ae}(z)$ 的空间 Fourier 变换（定义 2.18 的连续孔径响应）。

**波束方向图形式。** 将 $\Upsilon$ 限制到可视区域（平面波约束下 $k_z = \frac{2\pi}{\lambda}\cos\theta$），得到方向图乘积定理的标准表述：

$$
\boxed{B(\theta) = B_{\text{AF}}(\theta)\, B_{\text{el}}(\theta)},
$$

即**总波束方向图 = 阵列因子 × 阵元方向图**。三维情形直接推广为 $B(\theta,\phi) = B_{\text{AF}}(\theta,\phi)\,B_{\text{el}}(\theta,\phi)$。乘积在 dB 尺度上化为相加：$B_{\text{dB}} = B_{\text{AF,dB}} + B_{\text{el,dB}}$，因此阵元方向图常以"调制包络"的形象出现在方向图中。

**物理解释与影响。** 阵列因子的**零点与栅瓣位置不变**——乘积只改变总方向图的幅度包络，不改变角度结构；**栅瓣可被阵元方向图自然抑制**——若阵元方向图在栅瓣方向增益低甚至为零，总方向图在该方向的栅瓣被压低或完全消除，这是工程上用有向阵元缓解大间距（$d > \lambda/2$）栅瓣问题的手段（§ 2.10 参数 7）；**扫描范围受限**——阵元方向图若在目标方向增益低，主瓣同样被压低，阵列的可用扫描范围受阵元方向图覆盖角限制（§ 2.11）。

**三个代表性几何情形。** 原书给出三个典型例子（图 2.31–2.33）：**共线**（阵元孔径沿 $z$ 轴与线阵共线，阵元方向图仅依赖 $k_z$，总方向图可在 $k_z$ 空间一维表示）；**垂直**（如偶极子阵列，阵元方向图在垂直于轴线的平面内变化，总方向图必须在完整 $\mathbf{k}$ 空间三维表示，原书 Problem 2.8.3）；**矩形平面阵**（将 $x$ 方向的一列传感器视为 $z$ 方向线阵的"阵元"，且各列加权相同，则总阵列因子分解为两个一维阵列因子之积——第 4 章矩形阵可分离性的由来）。

**互耦（Mutual Coupling）。** 方向图乘积定理忽略了阵元间的相互作用。实际阵列中还存在**互耦**——相邻阵元通过电磁/声场相互影响，使阵元的实际方向图偏离孤立阵元的方向图。互耦的详细建模见 Balanis [Bal82]、Yeh et al. [YLU89]、Friedlander & Weiss [FW91]、Svantesson [Sva99] 等文献；原书在多处指出互耦的影响，但不深入展开。

> **例 2.11**（半波偶极子阵元的栅瓣抑制）：考虑 $N=10$ 元 ULA，$d = \lambda$。由 § 2.10 参数 7，法向波束的第一栅瓣位于 $u = \pm 1$——恰好落在可视区边界（临界情形）。若阵元为沿 $z$ 轴放置的半波偶极子，其阵元方向图
>
> $$
> B_{\text{el}}(\theta) = \frac{\cos\!\bigl(\frac{\pi}{2}\cos\theta\bigr)}{\sin\theta},
> $$
>
> 在与轴线夹角 $\theta = 0^\circ, 180^\circ$（即 $u = \pm 1$）处为零。栅瓣恰好位于这两个方向，总方向图在栅瓣处被完全抑制——栅瓣问题在不改变阵列因子的情况下得到缓解。代价是端射方向的覆盖同时丧失：若目标恰好位于端射附近，主瓣也会被阵元方向图压低。
