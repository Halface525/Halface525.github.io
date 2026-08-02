---
data: 2026-08-02
tags:
  - 阵列处理
  - 信号处理
  - 阵列合成
lastdate: 2026-08-02
auther: Halface
---
本章讨论阵列信号处理的**逆问题**——合成（synthesis）：给定期望的波束方向图 $B_d(\cdot)$ 与约束条件（旁瓣水平、主瓣宽度、零点位置），如何设计阵元权重向量 $\mathbf{w}$ 来实现它。内容涵盖谱加权、阵列多项式与 z 变换、波数空间的方向图采样（Woodward 方法）、给定旁瓣水平的最小主瓣宽度（Dolph-Chebychev / Taylor / Villeneuve）、最小二乘与极小极大合成、零点调向、差波束、空间非均匀线阵、波束空间处理与宽带阵列，对应原书第 3 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 3.1** 本章符号表（Notation）

| 符号 | 含义与说明 |
| --- | --- |
| **合成目标 / Synthesis Objectives** | |
| $B_d(u),\; B_d(\psi)$ | 期望波束方向图（desired beampattern），可在 $u$ 空间或 $\psi$ 空间给定 |
| $R$ | 旁瓣比（sidelobe ratio），主瓣峰值与旁瓣峰值之比，常以 dB 计 |
| $SLL$ | 旁瓣水平（sidelobe level），第一旁瓣相对主瓣峰值的高度 |
| $T_m(x)$ | $m$ 阶第一类 Chebychev 多项式 |
| **阵列与孔径 / Array and Aperture** | |
| $N$ | 阵元数（number of sensors） |
| $\tilde{n}$ | 中心对称阵元索引，$\tilde{n} = n - \frac{N-1}{2}$，$\tilde{n} = -\frac{N-1}{2}, \ldots, \frac{N-1}{2}$ |
| $d$ | 阵元间距（inter-element spacing） |
| $L$ | 孔径长度（aperture length），$L = (N-1)d$ |
| $\lambda$ | 波长（wavelength） |
| $z_\lambda = z/\lambda$ | 归一化空间坐标（normalized spatial coordinate） |
| $w(z)$ | 连续孔径函数（aperture function） |
| **方向与电角度 / Direction and Electrical Angle** | |
| $u = \cos\theta$ | 方向余弦（direction cosine） |
| $\theta$ | 入射方向与阵列轴线的夹角 |
| $\psi$ | 电角度，$\psi = \frac{2\pi d}{\lambda}\cos\theta$；标准线阵（$d = \lambda/2$）时 $\psi = \pi u$ |
| $v$ | Taylor 分布的归一化波束变量 |
| **权重与方向图 / Weighting and Beampattern** | |
| $\mathbf{w}$ | 权重向量（weight vector），$\mathbf{w} \in \mathbb{C}^N$；$w_n$ 为第 $n$ 个阵元权重 |
| $w(\tilde{n})$ | 加权函数（weighting function），谱加权的对象 |
| $c(p),\, c_m,\, c_2(p)$ | 谱加权的归一化常数 |
| $B(\psi),\, B(u)$ | 波束方向图（beampattern） |
| $B_z(z)$ | z 变换域方向图（array polynomial） |
| $B_a(\psi)$ | 差波束方向图（difference beampattern） |
| **z 变换 / z-Transform** | |
| $z = e^{j\psi}$ | 变换变量（transform variable） |
| $z_n$ | 方向图零点（root of $B_z$） |
| **采样与 DFT / Sampling and DFT** | |
| $u_m$ | 方向图采样方向（sampling direction） |
| $\Delta u_s = \lambda/L$ | 采样间隔（sampling interval） |
| $b_n$ | 加权序列的 DFT 形式 |
| $B(k)$ | 方向图采样值（DFT 域） |
| **经典分布 / Classical Distributions** | |
| $x_0$ | Chebychev 映射参数，$T_{N-1}(x_0) = R$ |
| $\bar{n}$ | Taylor 分布中被移动的内零点对数 |
| $A$ | Taylor 旁瓣参数，$\cosh(\pi A) = R$ |
| $v_n$ | Taylor 分布移动后的零点位置 |
| $p$ | 升余弦加权的比例参数（$0 \le p \le 1$） |
| **优化与约束 / Optimization and Constraints** | |
| $\xi$ | 最小二乘误差泛函（least-squares error） |
| $a_m$ | 期望方向图的 Fourier 级数系数 |
| $R[m]$ | 截断窗函数（truncation window） |
| $\delta$ | 极小极大（Chebychev）误差上界 |
| $\mathbf{C}$ | 零点约束矩阵（constraint matrix） |
| $\mathbf{P}_{\mathbf{C}}^\perp$ | 约束空间正交补上的投影矩阵 |
| **波束空间 / Beamspace** | |
| $N_{bs}$ | 波束空间维数（beamspace dimension） |
| $\mathbf{B}_{bs}$ | 波束空间变换矩阵（beamspace matrix），$N \times N_{bs}$ |
| $\mathbf{v}_{bs}(\psi)$ | 波束空间阵列流形向量 |
| **宽带 / Broadband** | |
| $B_s$ | 信号带宽（signal bandwidth） |
| $\lambda_l,\, \lambda_u$ | 最低、最高频率对应的波长 |
| $BW_{NN}$ | 归一化零点-零点波束宽度（normalized null-to-null beamwidth） |

---

## 3.1 谱加权技术（Spectral Weighting）

**核心思想。** 对均匀线阵（阵元间距 $d = \lambda/2$），波束方向图 $B(u)$ 与权值序列 $w_n$ 构成**傅里叶变换对**：

$$
B(u) = \sum_{n=-(N-1)/2}^{(N-1)/2} w_n\, e^{j n \pi u},
$$

设计权值以获得理想方向图，等价于设计一个窗函数以获得理想频率响应。

> **定义 3.1**（谱加权 / Spectral Weighting）：谱加权是对均匀权值序列进行**锥削**（tapering）——让阵列中心的权值大、边缘的权值小、平滑过渡到零，以降低方向图旁瓣的过程。均匀加权 $w(\tilde{n}) = 1/N$ 是锥削的零级（不锥削）情形。

**均匀加权的旁瓣特性。** 均匀加权 $w_n = 1/N$ 的方向图是 Dirichlet 核（sinc 型函数），**第一旁瓣只比主瓣低约 $13$ dB**，多数应用不可接受。根源在于均匀加权在阵列**边缘发生突变**（权值从 1 跳到 0）；时域/空域的突变在频域/波数域表现为高旁瓣。

**基本策略与代价。** 让权值在边缘平滑衰减到 0，消除边缘突变，旁瓣随之降低；**代价是主瓣变宽**。这是阵列合成最基本的权衡：

$$
\text{旁瓣降低} \Longleftrightarrow \text{主瓣增宽} \Longleftrightarrow \text{方向性损失} \Longleftrightarrow \text{敏感度增加}.
$$

**具体的谱加权函数。** 以下窗函数分为两组：余弦族（1）–（5）通过控制谐波个数在旁瓣峰值处置零点；最优族（6）（7）直接以能量集中为目标。

**（1）Cosine 加权。**

$$
w(\tilde{n}) = \sin\!\left(\frac{\pi}{2N}\right)\cos\!\left(\frac{\pi\tilde{n}}{N}\right),
$$

余弦函数在边缘自然衰减到 0。利用 $\cos x = (e^{jx} + e^{-jx})/2$，余弦加权可看作**三个常规波束的叠加**（一个指向正侧向，两个指向 $\pm 1/N$）。效果：HPBW 从 $0.89 \cdot (2/N)$ 增至 $1.18 \cdot (2/N)$，第一旁瓣从 $-13.2$ dB 降到 $-23.5$ dB。

**（2）升余弦加权（Raised Cosine）。**

$$
w(\tilde{n}) = c(p)\left[p + (1-p)\cos\!\left(\frac{\pi\tilde{n}}{N}\right)\right],
$$

参数 $p$ 调节主瓣宽度与旁瓣高度的折中：$p=1$ 为均匀加权（最窄主瓣、最高旁瓣），$p=0$ 为纯余弦加权（最宽主瓣、最低旁瓣），$0<p<1$ 为中间状态。原书取 $p = 0.31, 0.17, 0$，对应 HPBW $1.03,\, 1.09,\, 1.18$（单位 $2/N$），第一旁瓣 $-20.0,\, -22.0,\, -23.5$ dB。

**（3）Cosine$^m$ 加权。**

$$
w_m(\tilde{n}) = c_m \cos^m\!\left(\frac{\pi\tilde{n}}{N}\right),
$$

$m$ 越大，边缘衰减越平滑、旁瓣越低，主瓣越宽（$m=2$ 时即 **Hann 加权**）：

**表 3.2** Cosine$^m$ 加权的方向图参数（单位 $2/N$）

| $m$ | 第一旁瓣 | HPBW |
| --- | --- | --- |
| $2$（Hann） | $-31.4$ dB | $1.44$ |
| $3$ | $-39.4$ dB | $1.66$ |
| $4$ | $-46.7$ dB | $1.85$ |

经验规律：$m$ 每增加 1，旁瓣约降低 $8$ dB、主瓣约增宽 $0.2 \cdot (2/N)$。

**（4）Hamming 加权。**

$$
w(\tilde{n}) = 0.54 + 0.46\cos\!\left(\frac{2\pi\tilde{n}}{N}\right),
$$

系数 $g_0 = 0.54,\, g_1 = 0.46$ 通过在**第一个旁瓣峰值位置 $u = 3/N$ 置零点**（并归一化侧向响应）解得。效果：第一旁瓣被完全"消除"，第一**非零**旁瓣为 $-39.5$ dB；HPBW $= 1.31 \cdot (2/N)$，仅比均匀加权略宽，甚至窄于 Hann 加权——这是"旁瓣越低主瓣越宽"趋势的一个例外。代价是第二旁瓣较高且衰减缓慢（权值存在阶跃不连续，旁瓣渐近按 $1/v$ 缓慢下降）。

**（5）Blackman-Harris 加权。**

$$
w(\tilde{n}) = 0.42 + 0.50\cos\!\left(\frac{2\pi\tilde{n}}{N}\right) + 0.08\cos\!\left(\frac{4\pi\tilde{n}}{N}\right),
$$

Hamming 用两个余弦项（常数项 + 一次谐波），Blackman-Harris 用**三个**（+ 二次谐波），在前两个旁瓣峰值处置零点。效果：第一旁瓣 $-56.6$ dB，HPBW $1.65 \cdot (2/N)$。规律：**谐波项越多，可控制的旁瓣越多，但主瓣越宽**。

![图 3.1：常见谱加权窗函数的权值序列（左）与 u 空间波束方向图（右），N=101。锥削越深（均匀→cos→cos²→Hamming→Blackman-Harris），旁瓣逐级降低、主瓣逐级展宽。](../pic/ch3_谱加权对比.png)

**表 3.3** 常见谱加权函数对照表（HPBW 单位 $2/N$，标准线阵）

| 加权 | HPBW | 第一旁瓣 [dB] |
| --- | --- | --- |
| 均匀 Uniform | $0.89$ | $-13.2$ |
| cos | $1.18$ | $-23.5$ |
| cos$^2$（Hann） | $1.44$ | $-31.4$ |
| cos$^3$ | $1.66$ | $-39.4$ |
| cos$^4$ | $1.85$ | $-46.7$ |
| Hamming | $1.31$ | $-39.5$（第一非零旁瓣） |
| Blackman-Harris | $1.65$ | $-56.6$ |

（数值与原书表 3.4 一致，MATLAB 仿真已复核。）

**（6）离散长球序列（DPSS）。** 上述窗函数都是"经验 + 折中"，可以提出更优的问题：给定主瓣区域 $[-\psi_0, \psi_0]$，如何设计权值使**该区域内的能量占总能量的比例最大**？定义能量集中比

$$
\alpha = \frac{\displaystyle\int_{-\psi_0}^{\psi_0} |B(\psi)|^2\,\mathrm{d}\psi}{\displaystyle\int_{-\pi}^{\pi} |B(\psi)|^2\,\mathrm{d}\psi},
$$

利用 Parseval 关系可写为

$$
\alpha = \frac{\mathbf{w}^H \mathbf{A}\, \mathbf{w}}{2\pi\,\mathbf{w}^H \mathbf{w}},
\qquad
[\mathbf{A}]_{mn} = 2\psi_0\, \text{sinc}\bigl((m-n)\psi_0\bigr),
$$

最大化 $\alpha$ 等价于求 $\mathbf{A}$ 的**最大特征值对应的特征向量**——它被称为**第一离散长球序列**（DPSS，也称 Slepian 序列），是给定主瓣宽度下能量集中最优的权值，也是旁瓣-主瓣折中的**理论上界**。代价是需要解特征值问题，计算量大。

**（7）Kaiser 加权。**

$$
w(\tilde{n}) = I_0\!\left(\beta\sqrt{1 - \left(\frac{2\tilde{n}}{N}\right)^2}\right),
$$

DPSS 数学上最优但计算复杂。Kaiser 窗用**修正的零阶第一类 Bessel 函数** $I_0$ 逼近 DPSS，计算简单且几乎一样好。参数 $\beta$ 调节折中：$\beta$ 增大 $\to$ 旁瓣降低、主瓣变宽；$\beta$ 减小 $\to$ 接近均匀加权。Kaiser 窗在 §3.5 还用于抑制最小二乘合成的吉布斯振荡。

**本节小结。** 谱加权的逻辑链：

```
均匀加权 → 边缘突变 → 高旁瓣
    ↓
让权值在边缘平滑衰减 → 低旁瓣
    ↓
不同的衰减函数 → 不同的主瓣-旁瓣折中
    ↓
按需求选择最合适的窗函数
```

![图 3.2：主瓣宽度—旁瓣高度折中散点图（N=101）。横轴 HPBW（单位 2/N），纵轴第一旁瓣抑制量（dB），点越靠左上方，主瓣越窄、旁瓣越低，折中越优。](../pic/ch3_谱加权折中.png)

---

## 3.2 阵列多项式与 z 变换（Array Polynomials and the z-Transform）

**引入 z 变换的动机。** 波束方向图 $B_\psi(\psi)$ 是关于 $e^{j\psi}$ 的多项式，可以因式分解，从而显露出**零点**的位置；零点位置决定方向图形状：

$$
\text{设计方向图} \Longleftrightarrow \text{在复平面上放置零点}.
$$

**z 变换的建立。** 定义 $z = e^{j\psi}$，去掉常数相位后波束方向图为

$$
\boxed{B_z(z) = \sum_{n=0}^{N-1} w_n\, z^{-n}},
$$

这是一个 $N-1$ 次多项式，有 $N-1$ 个零点；方向图本身是 $B_z(z)$ 在单位圆 $|z|=1$ 上的取值。

> **定理 3.1**（方向图的多项式表示与因式分解）：$B_z(z)$ 可因式分解为
>
> $$
> B_z(z) = w_{N-1} \prod_{n=1}^{N-1} (z - z_n),
> $$
>
> 方向图的幅度等于**单位圆上的点 $z$ 到所有零点距离的乘积**：
>
> $$
> |B_z(z)| = |w_{N-1}| \prod_{n=1}^{N-1} |z - z_n|.
> $$

**零点的重要性。** 由上式：零点在单位圆上（$|z_n| = 1$）$\Rightarrow$ 该方向图**完全为零**；零点靠近单位圆 $\Rightarrow$ 深零陷；零点远离单位圆 $\Rightarrow$ 该处响应较高。

> **定理 3.2**（实对称权值的零点结构）：当权值实对称（$w_n = w_{N-1-n}$）时，$B_z(z)$ 的零点成对出现：
>
> (1) **实轴上倒数成对**：若 $z = r$ 是零点，则 $z = 1/r$ 也是零点；
> (2) **单位圆上共轭成对**：若 $z = e^{j\theta}$ 是零点，则 $z = e^{-j\theta}$ 也是零点；
> (3) **复平面四重对称**：若 $z = r e^{j\theta}$ 是零点，则 $r^{-1}e^{j\theta},\, r e^{-j\theta},\, r^{-1} e^{-j\theta}$ 也都是零点。
>
> 物理意义：零点关于实轴对称分布，保证方向图是**实的**（无相位畸变）。

**可视区域与非可视区域。** 单位圆上只有一部分对应物理可观测方向：标准线阵（$d = \lambda/2$）$\psi = \pi u \in [-\pi, \pi]$，**整个单位圆可视**；$d < \lambda/2$ 时可视区仅为一段弧；$d > \lambda/2$ 时可视区在单位圆上重叠，出现栅瓣。关键洞察：**零点放在可视区域外不影响主波束形状，但会影响权值分布**——这是合成中常被利用的自由度。

> **定理 3.3**（零点附近的波束行为）：设方向图在 $\psi_0$ 处有一 $q$ 阶零点（$q$ 个零点重合），则在该点附近 $|B(\psi)| \propto |\Delta\psi|^q$。单零点（$q=1$）方向图**线性**穿过，零陷尖锐；二阶零点（$q=2$）方向图**二次**趋零，零陷更宽、更平坦。
>
> 工程意义：单零点零陷尖锐、对干扰方向**敏感**（干扰稍移抑制即变差）；二阶零点零陷更宽、对干扰方向变化**更稳健**，但消耗两个自由度。

**设计流程。** 合成即放置零点：在复平面上放置零点 $z_n$，计算乘积得到多项式，多项式系数即权值（取共轭）。

---

## 3.3 波数空间的方向图采样（Pattern Sampling in Wavenumber Space）

**Woodward 方法的动机。** 给定期望方向图 $B_d(u)$，直接做法是把 $B_d(u)$ 展开成 Fourier 级数，级数系数即权值。若 $B_d(u)$ 带宽受限，只需在 $u$ 空间以 $\lambda/L$ 为间隔采样即可完整重构。

**连续孔径的情形。**

> **定理 3.4**（连续孔径的方向图采样与重构）：长度为 $L$ 的连续孔径，其方向图与孔径函数构成空间 Fourier 变换对：
>
> $$
> \frac{1}{\lambda}B(u) = \int_{-L/(2\lambda)}^{L/(2\lambda)} w^*(z_\lambda)\, e^{j2\pi u z_\lambda}\,\mathrm{d}z_\lambda,
> $$
>
> 其中 $z_\lambda = z/\lambda$ 为归一化坐标。方向图的空间带宽由 $L$ 决定，采样间隔为
>
> $$
> \boxed{\Delta u_s = \frac{\lambda}{L}}.
> $$
>
> 物理意义：孔径越长，采样间隔越小，方向图可被更精细地控制。

**重构公式。** 在 $u_m = m\lambda/L$ 处给定采样值 $B_d(u_m)$，则

$$
B(u) = \sum_m B_d(u_m)\, \text{sinc}\!\left(\frac{\pi L}{\lambda}(u - u_m)\right),
$$

每个采样点贡献一个 **sinc 函数**（峰值在采样点、零点在其它采样点）。几何上，期望方向图被分解为一系列**相互正交的 sinc 函数**的加权和，加权系数即采样值。

**离散阵列的情形。** 对标准线阵（$N$ 个阵元，$d = \lambda/2$，$L = Nd$），采样间隔为 $2/N$：

$$
u_m = \frac{2}{N}\left(m - \frac{N-1}{2}\right), \qquad m = 0, 1, \ldots, N-1.
$$

**关键结论：采样点个数 = 阵元个数 = $N$，$N$ 个采样值唯一确定 $N$ 个权值。**

> **定理 3.5**（Woodward 采样与 DFT）：定义
>
> $$
> b_n = w_n\, e^{j n \pi \frac{N-1}{N}}, \qquad
> B(k) = B_\psi^*(\psi_k)\, e^{-j \psi_k \frac{N-1}{2}}, \qquad \psi_k = \frac{2\pi k}{N},
> $$
>
> 则 $\{b_n\}$ 与 $\{B(k)\}$ 构成**离散傅里叶变换对**：
>
> $$
> B(k) = \sum_{n=0}^{N-1} b_n\, e^{-j\frac{2\pi}{N}kn},
> \qquad
> b_n = \frac{1}{N}\sum_{k=0}^{N-1} B(k)\, e^{j\frac{2\pi}{N}kn},
> $$
>
> 权值由 $w_n = b_n\, e^{-j n\pi\frac{N-1}{N}}$ 恢复。
>
> 工程意义：给定期望方向图的 $N$ 个采样值，**一次 IDFT 即可得到权值**，计算量 $O(N\log N)$。

> **定理 3.6**（Parseval 关系）：方向图采样值与权值满足
>
> $$
> \boxed{\mathbf{w}^H\mathbf{w} = \frac{1}{N}\,\mathbf{B}_\psi^H \mathbf{B}_\psi}.
> $$
>
> 因此方向性、白噪声阵列增益、敏感度都可直接从方向图采样值计算——方向图幅度平方和决定 $\|\mathbf{w}\|^2$（第 2.12 节三大性能度量的枢纽）。

**本节小结。** Woodward 方法的本质：**用 DFT/IDFT 在波数域与阵元域之间来回转换**：

```
期望方向图 B_d(u) → 在 N 个点采样 → N 个采样值 → IDFT → N 个权值 w_n → DFT（验证）→ 合成方向图 B(u)
```

---

## 3.4 给定旁瓣水平的最小波束宽度（Minimum Beamwidth for Specified Sidelobe Level）

### 3.4.1 问题定义与 Chebychev 多项式

在给定最大旁瓣水平（如 $-30$ dB）的条件下，**主瓣宽度最小能达到多少**？这是经典阵列合成最核心的最优化问题。核心手段是利用 **Chebychev 多项式**的等波纹性质构造"所有旁瓣等高"的方向图，从而在给定旁瓣水平下把主瓣压到最窄。

### 3.4.2 Dolph-Chebychev 阵列

> **定理 3.7**（Chebychev 多项式的等波纹性质）：第一类 Chebychev 多项式 $T_m(x)$ 在 $x \in [-1,1]$ 上**等波纹振荡**，所有极值幅度均为 1；在区间之外单调增长。
>
> 设计思路：把可视区域映射到 $x \in [-1,1]$ 的某子区间（等波纹 $\to$ 旁瓣全部相等），把主瓣映射到 $x > 1$ 的区域（单调增长 $\to$ 主瓣）。Chebychev 多项式的**交替定理**保证：在所有阶数为 $m$、通过点 $(x_0, R)$ 的多项式中，$T_m(x)$ 在 $[-1,1]$ 上具有最小最大幅度——任何其它多项式要想旁瓣不高于 1，主瓣宽度必须更宽。**这从理论上保证了给定旁瓣水平下主瓣宽度最小。**

> **定理 3.8**（Dolph-Chebychev 方向图）：设旁瓣比为 $R$（主瓣峰值与旁瓣峰值之比，即 $T_{N-1}(x_0) = R$），则
>
> $$
> x_0 = \cosh\!\left(\frac{1}{N-1}\cosh^{-1} R\right),
> \qquad
> B(\psi) = \frac{1}{R}\,T_{N-1}\!\left(x_0 \cos\frac{\psi}{2}\right).
> $$
>
> 全部旁瓣等高（等于 $1/R$），主瓣为最窄。

**求权值的工程方法。** 先求零点（$B(\psi_p) = 0$）：

$$
\psi_p = 2\cos^{-1}\!\left(\frac{1}{x_0}\cos\!\left(\frac{(2p-1)\pi}{(N-1)\,2}\right)\right), \qquad p = 1, 2, \ldots, N-1,
$$

再用这些零点构造阵列流形矩阵 $\mathbf{V}(\psi) = [\mathbf{v}(0),\, \mathbf{v}(\psi_1), \ldots, \mathbf{v}(\psi_{N-1})]$，求解线性方程

$$
\mathbf{w} = [\mathbf{V}^H(\psi)]^{-1}\mathbf{e}_1,
$$

即指定方向图在 $N$ 个点上的值（主瓣中心为 1，其余 $N-1$ 个零点为 0），用 $N$ 个方程解 $N$ 个未知权值。

> **例 3.1**（Dolph-Chebychev 的数值步骤）：$N = 10$，要求旁瓣 $R = 20$ dB（即 $-20$ dB）。先算 $x_0 = \cosh(\cosh^{-1}20/9) \approx 1.08$，再由上式得 9 个零点 $\psi_p$，解 $10\times10$ 线性方程组得到 10 个权值。所得方向图全部 9 个旁瓣恰为 $-20$ dB、主瓣 HPBW $\approx 1.79 \cdot (2/N)$，明显窄于均匀加权在同等旁瓣水平下的主瓣。注意旁瓣**不随远离主瓣而衰减**——远处旁瓣与近处一样高，这是与 Taylor 分布的关键区别。

**Riblet-Chebychev 加权。** 当 $d < \lambda/2$ 时，Dolph-Chebychev **不再最优**：可视区域未覆盖整个振荡区间 $[-1,1]$，浪费了部分等波纹能力。Riblet 的改进：用 $\cos\psi$ 而非 $\cos(\psi/2)$ 展开，使可视区域正好覆盖完整区间。

**优缺点。** 优点：给定旁瓣水平下主瓣宽度**最小**，所有旁瓣**相等**、无一超过设计值。缺点：旁瓣不衰减——实际中远处旁瓣会累积干扰能量（因此常改用 Taylor 分布让旁瓣渐降）。

### 3.4.3 Taylor 分布

**动机。** 希望旁瓣**逐渐衰减**，而不是保持常数。

> **定理 3.9**（Taylor 分布）：Taylor 的巧妙思路：
>
> 1. 从均匀加权出发，其零点是等间隔的：$v_n = \pm 1, \pm 2, \ldots$；
> 2. 把**靠近主瓣的 $\bar{n}-1$ 个零点向内移动**（靠近 0），使靠近主瓣的旁瓣降低；
> 3. 保持**远处的零点不变**，使远处旁瓣仍以 $1/v$ 衰减。
>
> 方向图为
>
> $$
> B_T(v) = \frac{\sin(\pi v)}{\pi v}\cdot
> \frac{\displaystyle\prod_{n=1}^{\bar{n}-1}\left(1 - \frac{v^2}{v_n^2}\right)}
>      {\displaystyle\prod_{n=1}^{\bar{n}-1}\left(1 - \frac{v^2}{n^2}\right)},
> $$
>
> 其中移动后的零点位置为
>
> $$
> v_n = \bar{n}\left[\frac{A^2 + \left(n - \frac{1}{2}\right)^2}{A^2 + \left(\bar{n} - \frac{1}{2}\right)^2}\right]^{1/2},
> $$
>
> 参数 $A$ 由旁瓣水平决定：$\cosh(\pi A) = R$。

**$\bar{n}$ 的选择。** $\bar{n}$ 是"被移动的零点对数"（内零点数）。若 $\bar{n}$ 太大，孔径加权函数在边缘会**上翘**（不希望的边缘增强）；通常取使加权函数单调递减的最大 $\bar{n}$。

### 3.4.4 Villeneuve 分布

**问题。** Taylor 分布对**连续孔径**推导，对离散阵列采样会引入误差。

> **定理 3.10**（Villeneuve 分布）：直接在离散阵列上合成：
>
> 1. 从均匀加权的零点 $\psi_{un} = 2\pi n/N$ 出发；
> 2. 把前 $\bar{n}-1$ 个零点向 Dolph-Chebychev 零点移动，移动量**渐进过渡**：在第 $\bar{n}$ 个零点处平滑衔接回均匀零点。
>
> 具体地，Chebychev 零点 $\psi_n$ 乘上缩放因子 $\sigma$，使第 $\bar{n}$ 个零点与均匀情形一致：$\psi_n' = \sigma\psi_n$（$n = 1, \ldots, \bar{n}-1$），其余零点保持均匀 $\psi_{un} = 2\pi n/N$（$n = \bar{n}, \ldots, (N-1)/2$）。

**效果。** 与 Taylor 分布几乎相同，但对小阵列（$N \le 11$）更准确（直接基于离散几何，无采样误差）。

---

## 3.5 最小二乘误差方向图合成（Least Squares Error Pattern Synthesis）

**核心思想。** 期望方向图不要求精确匹配，只要求在**最小二乘意义下**最优：

$$
\xi = \int_{-\pi}^{\pi} \left|B_d(\psi) - \mathbf{w}^H \mathbf{v}(\psi)\right|^2 \mathrm{d}\psi.
$$

**求解。** 对 $\mathbf{w}^H$ 求梯度并令其为零：

$$
\int_{-\pi}^{\pi} \mathbf{v}(\psi)\,B_d^*(\psi)\,\mathrm{d}\psi - \left\{\int_{-\pi}^{\pi} \mathbf{v}(\psi)\mathbf{v}^H(\psi)\,\mathrm{d}\psi\right\}\mathbf{w}_o = 0.
$$

对标准线阵，$\int_{-\pi}^{\pi}\mathbf{v}(\psi)\mathbf{v}^H(\psi)\,\mathrm{d}\psi = 2\pi\mathbf{I}$，故

> **定理 3.11**（最小二乘最优权值）：最优权值恰是期望方向图的 **Fourier 级数系数**：
>
> $$
> \boxed{w_{n,o}^* = \frac{1}{2\pi}\int_{-\pi}^{\pi} e^{-jn\psi}\, B_d(\psi)\,\mathrm{d}\psi}.
> $$

**吉布斯现象。** 当 $B_d(\psi)$ 有**不连续点**（如矩形方向图）时，有限项 Fourier 级数在不连续点附近产生**上冲/下冲振荡**（约 $9\%$ 的过冲，不随项数增多而消失）——即**吉布斯现象**（Gibbs phenomenon）。

> **例 3.2**（吉布斯现象）：用 $N$ 元阵列逼近"矩形"理想方向图。$N$ 越大，过渡带越窄，但跳变处始终有过冲约 $9\%$，带外振荡不衰减到零——直接截断的 Fourier 级数无法精确逼近不连续方向图。

**加窗抑制振荡。** 用窗函数 $R[m]$ 截断 Fourier 级数：

$$
\hat{B}_d(\psi) = \sum_{m=-\infty}^{\infty} a_m\, R[m]\, e^{jm\psi},
$$

这等价于把理想方向图与窗函数的 Fourier 变换做卷积

$$
\hat{B}_d(\psi) = B_d(\psi) * B_R(\psi),
$$

窗函数把不连续点"抹平"，减少振荡，但**过渡带变宽**。

> **例 3.3**（Kaiser 窗设计步骤）：Kaiser 窗给出"衰减--过渡带--阵元数"的定量关系：
>
> 1. 确定过渡带宽度 $\Delta\psi = \psi_s - \psi_p$ 与所需衰减 $A = -20\log\delta$；
> 2. 计算 $\beta$：$A > 50$ 时 $\beta = 0.1102\,(A - 8.7)$；$21 \le A \le 50$ 时 $\beta = 0.5842\,(A-21)^{0.4} + 0.07886\,(A-21)$；
> 3. 计算所需阵元数：$N - 1 = \dfrac{A - 8}{2.285\,\Delta\psi}$。

---

## 3.6 极小极大设计（Minimax Design）

**极小极大准则的动机。** 最小二乘法使**总能量误差**最小，但允许在某些点上出现**很大的局部误差**。应用中通常要求**最大误差**受控：

$$
\min_{\mathbf{w}}\ \max_{\psi \in \mathcal{F}} \left|B_d(\psi) - B(\psi)\right|,
$$

其中 $\mathcal{F}$ 为感兴趣区域（主瓣/旁瓣可分别加权）。这就是**极小极大（Chebychev）准则**。

> **定理 3.12**（交替定理 / Alternation Theorem）：$P(x)$ 是使 $\|E\|$ 最小的唯一的 $L$ 阶多项式，**当且仅当**误差函数 $e_{pm}(x)$ 在感兴趣区域 $\mathcal{F}_p$ 中至少有 $L+2$ 个**交替点**：
>
> $$
> e_{pm}(x_i) = -e_{pm}(x_{i+1}) = \pm \|E\|,
> $$
>
> 即误差在 $L+2$ 个点上**依次取正负最大值且绝对值相等**（等波纹）。

**直观理解。** $L$ 阶多项式有 $L+1$ 个自由度。$L+2$ 个交替点意味着误差函数被"挤压"到最小可能范围——无法再降低最大误差而不增加其它点误差。**最优解 = 等波纹解。**

> **例 3.4**（Remez 迭代算法）：即 FIR 设计中经典的 **Parks–McClellan–Rabiner 算法**（加权 Chebychev 逼近 + Remez 交换）：
>
> 1. 选择 $L+2$ 个初始交替点 $\psi_i$；
> 2. 求解误差 $\delta$：$\delta = \dfrac{\sum_{k=1}^{L+2} b_k\, B_d(e^{j\psi_k})}{\sum_{k=1}^{L+2} \dfrac{b_k\,(-1)^{k+1}}{W_{pm}(\psi_k)}}$，其中 $b_k = \prod_{i\neq k}\dfrac{1}{x_k - x_i}$，$x_i = \cos\psi_i$；
> 3. 用 Lagrange 插值重建完整方向图；
> 4. 找出实际最大误差点，若与当前交替点不一致则替换，重复；
> 5. 迭代至收敛。

**三种合成方法的比较。**

**表 3.4** 三种方向图合成方法比较

| 方法 | 准则 | 特点 |
| --- | --- | --- |
| Woodward 采样 | 精确匹配采样点 | 简单，但采样点间可能振荡 |
| 最小二乘 | 总能量误差最小 | 解析解（Fourier 系数），可能有局部大误差 |
| 极小极大（P–Mc–R） | 最大误差最小 | 等波纹，过渡带最陡，需迭代 |

---

## 3.7 零点调向（Null Steering）

**零点调向的动机。** 若已知某方向存在强干扰（如干扰机），最好在该方向设置**完全零点**，彻底消除干扰。

**零点约束。** 在波数 $k_J$ 处置零点：

$$
B(k_J) = \mathbf{w}^H \mathbf{v}_k(k_J) = 0,
$$

对 ULA 等价于

$$
\sum_{n=-(N-1)/2}^{(N-1)/2} w_n^*\, e^{jn\psi_J} = 0.
$$

**高阶零点。** 若干扰方向不确定或干扰在移动，可设置**导数零点**（同时要求方向图及其导数为零）：

$$
B(k_J) = 0 \quad\text{且}\quad \left.\frac{\mathrm{d}}{\mathrm{d}k}B(k)\right|_{k=k_J} = 0,
$$

产生**二阶零点**，零陷更宽、更平坦，对干扰方向变化更稳健。

> **定理 3.13**（约束最小二乘解）：给定理想方向图 $B_d(k)$，在满足 $M_0$ 个零点约束 $\mathbf{C}^H\mathbf{w} = \mathbf{0}$（$\mathbf{C} = [\mathbf{v}_k(k_1), \ldots, \mathbf{v}_k(k_{M_0})]$）的条件下，最接近 $B_d(k)$ 的最优权值为
>
> $$
> \mathbf{w}_o^H = \mathbf{w}_d^H - \mathbf{w}_d^H\mathbf{C}\left[\mathbf{C}^H\mathbf{C}\right]^{-1}\mathbf{C}^H
> = \mathbf{w}_d^H \mathbf{P}_{\mathbf{C}}^\perp,
> $$
>
> 其中 $\mathbf{P}_{\mathbf{C}}^\perp = \mathbf{I} - \mathbf{C}(\mathbf{C}^H\mathbf{C})^{-1}\mathbf{C}^H$。**几何解释：把理想权值 $\mathbf{w}_d$ 投影到与约束空间正交的子空间上。**

**零点的物理意义。** 对单个零阶零点，

$$
B_o(k) = B_d(k) - a \cdot B_c(k - k_J),
$$

其中 $B_c(k - k_J)$ 是指向 $k_J$ 的常规波束。**最优方向图 = 理想方向图 $-$ 指向干扰方向的常规波束的某个倍数**，倍数 $a$ 由 $B_o(k_J) = 0$ 确定：$a = B_d(k_J)/B_c(0) = B_d(k_J)$。

---

## 3.8 差波束与单脉冲（Difference Beams and Monopulse）

**差波束的动机。** 精确测量信号角度时，和波束（常规波束）在主瓣中心响应最大，但中心附近**斜率接近零**——无法判断信号偏左还是偏右。**差波束**在主瓣中心响应为零，中心附近有**很大的斜率**：信号角度偏离中心时差波束输出与偏离量成正比——它是**角度误差传感器**。

**差波束的构造。** 让阵列权值**反对称**：$w_{-n} = -w_n$。对偶数 $N$：

$$
B_a(\psi) = 2j\sum_{m=1}^{N/2} w_m \sin\!\left(\left(m - \frac{1}{2}\right)\psi\right).
$$

均匀反对称加权（$w_m = 1/N$）时

> **定理 3.14**（均匀加权差波束方向图）：
>
> $$
> \boxed{B_a(\psi) = \frac{2j\,\sin^2(N\psi/4)}{N\sin(\psi/2)}}.
> $$

**差波束的性质。**

**表 3.5** 均匀加权差波束的主要性质

| 性质 | 值 |
| --- | --- |
| 主瓣中心响应 | $0$ |
| 中心斜率 | $N/4$ |
| 第一零点位置 | $4\pi/N$（偶数 $N$） |
| 第一旁瓣 | 比主瓣（峰值）低 $10$ dB |

**单脉冲测角。**

> **例 3.5**（单脉冲测角）：同时形成和波束 $\Sigma$ 与差波束 $\Delta$；收到回波后计算比值 $\Delta/\Sigma$，该比值与角度偏离量成正比。**只需一次测量即可确定角度误差，无需扫描**——这是雷达单脉冲（monopulse）测角的基本原理。

---

## 3.9 空间非均匀线阵（Spatially Non-uniform Linear Arrays）

### 3.9.1 非均匀间距的动机

**动机。** 用更少的阵元实现同样的孔径长度。均匀线阵需要 $N = L/d$ 个阵元；若阵元间距不均匀，可能用**更少的阵元**覆盖同样大的孔径。**代价**：方向图变差（旁瓣升高、不再有规则的完整零点）。

### 3.9.2 最小冗余阵列

> **定义 3.2**（最小冗余阵列 / Minimum Redundancy Linear Array）：阵元间距差（阵元对之间的空间延迟差）**覆盖尽可能多的不同值、且每个值只出现一次**的阵列。
>
> 原理：阵列协方差矩阵 $\mathbf{R}_x$ 的元素只依赖阵元间距差 $i - j$。若每个距离差只出现一次，则对 $\mathbf{R}_x$ 的估计最"高效"（每个滞后值由最少的阵元对估计，方差最小）。

> **例 3.6**（4 阵元 MRLA，位置 $\{0, 1, 4, 6\}$）：距离差 $\{1, 2, 3, 4, 5, 6\}$ 全部覆盖且各一次，等效孔径 $6d$（相当于 7 阵元标准线阵）。相关阵列（co-array）定义为
>
> $$
> c(\gamma) = \sum_{|m-n|=\gamma} w_m w_n^*,
> $$
>
> MRLA 的目标是使 $c(\gamma)$ 除原点外尽可能为 0 或 1。

### 3.9.3 方向图设计算法（Bell–Van Trees–Griffiths）

对任意给定的阵元位置，如何设计权值使方向图满足要求？

> **定理 3.15**（BVG 算法）：把合成表述为带旁瓣约束的方向性最大化问题：
>
> 1. 定义旁瓣区域 $\Omega_i$ 与水平约束 $L_i$；
> 2. 最大化方向性：$\min\limits_{\mathbf{w}} \mathbf{w}^H\mathbf{A}\,\mathbf{w}$，约束 $\mathbf{w}^H\mathbf{v}_T = 1$，其中 $[\mathbf{A}]_{mn} = \text{sinc}(2\pi|p_m - p_n|/\lambda)$；
> 3. 加入旁瓣约束 $(\mathbf{w} - \mathbf{w}_{d,i})^H\mathbf{Q}_i(\mathbf{w} - \mathbf{w}_{d,i}) \le L_i$，其中 $[\mathbf{Q}_i]_{mn} = e^{j2\pi(p_m-p_n)u_i/\lambda} \cdot 2\Delta_i \cdot \text{sinc}(2\pi\Delta_i|p_m-p_n|/\lambda)$；
> 4. 用 Lagrange 乘子法求解：$\mathbf{w} = \mathbf{A}_Q^{-1}\mathbf{v}_T\left(\mathbf{v}_T^H\mathbf{A}_Q^{-1}\mathbf{v}_T\right)^{-1}$，其中 $\mathbf{A}_Q = \mathbf{A} + \sum_i\lambda_i\mathbf{Q}_i$；
> 5. 迭代调整 $\lambda_i$ 直到满足旁瓣约束。
>
> 优雅之处：**适用于任意阵列几何**（不仅限均匀线阵），且能显式控制旁瓣水平。

---

## 3.10 波束空间处理（Beamspace Processing）

**波束空间的动机。** 阵元数 $N$ 很大时直接处理 $N$ 维数据计算量巨大。若信号只出现在空间的一个有限区域，可用一组波束覆盖该区域、只处理这些波束。**好处**：维数从 $N$ 降到 $N_{bs} \ll N$，后续计算量大幅减少；对波束空间外的干扰天然有抑制。

**满维波束空间。**

> **定理 3.16**（正交波束与 Butler 矩阵）：用 $N$ 个正交的常规波束覆盖整个 $u$ 空间：
>
> $$
> B_m(u) = \frac{1}{N}\frac{\sin\left[\frac{\pi N}{2}\left(u - \frac{2m}{N}\right)\right]}{\sin\left[\frac{\pi}{2}\left(u - \frac{2m}{N}\right)\right]},
> $$
>
> 这些波束**正交**：$\mathbf{w}^H(m)\mathbf{w}(l) = \frac{1}{N}\delta_{ml}$。实现该变换的矩阵是 **Butler 矩阵**（本质是一个 DFT 矩阵），可逆——**无信息损失**。

**降维波束空间。** 只用部分波束覆盖感兴趣区域：

$$
\mathbf{x}_{bs} = \mathbf{B}_{bs}^H\mathbf{x},
$$

其中 $\mathbf{B}_{bs}$ 是 $N \times N_{bs}$ 矩阵。波束空间阵列流形为

$$
\mathbf{v}_{bs}(\psi) = \mathbf{B}_{bs}^H \mathbf{v}(\psi).
$$

若 $\mathbf{B}_{bs}$ 的列不正交，可进行**白化**：

$$
\mathbf{B}_{bs} = \mathbf{B}_{no}\left[\mathbf{B}_{no}^H\mathbf{B}_{no}\right]^{-1/2},
$$

使波束空间的噪声保持白化。降维波束空间是第 6、7 章波束空间最优/自适应处理器的基础（本章点到为止，留到后面展开）。

---

## 3.11 宽带阵列（Broadband Arrays）

**窄带假设失效的条件。** 窄带假设要求 $B_s\cdot\Delta T_{\max} \ll 1$。带宽太宽或阵列太大时条件不成立。此时**阵元间距须满足最高频率的 $\lambda/2$ 以避免栅瓣**，而**孔径长度由最低频率决定**（分辨率），两要求叠加导致阵元数目过多：

> **定理 3.17**（宽带线阵的阵元数需求）：
>
> $$
> N = \left(\frac{2\alpha}{BW_{NN}}\right)\frac{\lambda_l}{\lambda_u},
> $$
>
> 其中 $\lambda_l/\lambda_u$ 为频带比（最低频/最高频波长比）。**频带比越大，需要的阵元越多。**

**嵌套阵列（Nested Array）。** 用多组子阵分别处理不同频段：第一组间距 $\lambda_u/2$、处理最高倍频程 $(f_u/2, f_u]$；第二组间距 $\lambda_u$、处理下一倍频程 $(f_u/4, f_u/2]$；依此类推。各子阵独立处理自己的频段，结果相加——避免"一个孔径被迫满足所有频段"导致阵元数目过多。

**恒定波束宽度技术。**

> **例 3.7**（恒定波束宽度）：目标——所有频率上的波束宽度相同。
>
> 1. 在最低频率 $f_l$ 设计理想方向图；
> 2. 对每个频率 $f_k$，在方向图的 $\psi$ 空间采样，采样点由 $u_n = \dfrac{c}{Ndf_k}\,n$ 确定；
> 3. 对采样值做 IDFT 得到该频率的权值。
>
> 效果：主瓣宽度在所有频率上**恒定**，旁瓣略有变化。

---

## 3.12 本章总结

第三章呈现了**确定性阵列合成的完整工具箱**。按设计目标分类：

**表 3.6** 第三章设计工具箱一览

| 目标 | 技术 | 特点 |
| --- | --- | --- |
| 降低旁瓣 | 谱加权（Hamming、Kaiser 等） | 简单，经验设计 |
| 最小主瓣宽度 | Dolph-Chebychev | 给定旁瓣下最优 |
| 旁瓣衰减 | Taylor、Villeneuve | 近旁瓣低、远旁瓣按 $1/v$ 衰减 |
| 匹配期望方向图 | 最小二乘（Woodward） | 总能量误差最小 / 采样匹配 |
| 控制最大误差 | Parks–McClellan | 等波纹，过渡带最陡 |
| 设置零点 | 零点约束（投影） | 特定方向抑制干扰 |
| 角度测量 | 差波束 | 单脉冲测角 |
| 减少阵元 | 非均匀 / 最小冗余阵列 | 用更少阵元覆盖大孔径 |
| 降低计算量 | 波束空间处理 | 降维处理 |
| 宽带信号 | 嵌套阵列 / 恒定波束宽度 | 频率无关响应 |

**贯穿本章的核心思想。** 所有合成技术本质上都是在解决一个优化问题：

$$
\min_{\mathbf{w}}\ \text{（主瓣宽度 / 误差 / 敏感度）} \quad \text{s.t.} \quad \text{（旁瓣水平 / 零点 / 匹配精度）},
$$

不同技术的区别在于：选什么目标函数、施加什么约束、用什么数学工具求解。三条数学主线——**傅里叶变换（谱加权、Woodward 采样）、多项式零点（z 变换）、最优化（最小二乘 / 极小极大）**——在第 5–7 章（空-时过程、最优波束成形、自适应处理）会反复出现；本章是这些工具在确定性（非自适应）情形下的首次应用。
