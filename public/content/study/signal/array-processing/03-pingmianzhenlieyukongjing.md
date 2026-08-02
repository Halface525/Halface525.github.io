---
data: 2026-08-03
tags:
  - 阵列处理
  - 信号处理
  - 平面阵列
lastdate: 2026-08-03
auther: Halface
---
本章把第 2–3 章的一维线阵理论推广到二维：传感器排布在一个平面（如 $xy$ 平面）上，可同时分辨来自不同方位与俯仰的信号——**二维空域滤波**。内容按几何结构展开：矩形阵列（矩形网格）、圆阵（环形）、圆孔径（圆盘）、六边形阵列（三角网格）与非平面阵列（圆柱/球面共形），对应原书第 4 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 4.1** 本章符号表（Notation）

| 符号 | 含义与说明 |
| --- | --- |
| **阵列几何 / Array Geometry** | |
| $N, M$ | $x$、$y$ 方向的阵元数（矩形阵列） |
| $d_x, d_y$ | $x$、$y$ 方向的阵元间距（inter-element spacing） |
| $(n, m)$ | 阵元索引，$n = 0,\ldots,N-1$，$m = 0,\ldots,M-1$ |
| $w_{nm}$ | 二维复权重（2-D weight） |
| $R$ | 圆阵 / 圆孔径半径（radius） |
| $\theta, \phi$ | 俯仰角（elevation）、方位角（azimuth） |
| $u_x, u_y$ | 方向余弦，$u_x = \sin\theta\cos\phi$，$u_y = \sin\theta\sin\phi$ |
| $u_r = \sqrt{u_x^2 + u_y^2}$ | 径向方向余弦 |
| $\lambda, k_0$ | 波长（wavelength）、波数（wavenumber），$k_0 = 2\pi/\lambda$ |
| $\mathbf{p}_n$ | 第 $n$ 个阵元的二维位置向量 |
| **电角度 / Electrical Angle** | |
| $\psi_x, \psi_y$ | 二维电角度，$\psi_x = \frac{2\pi d_x}{\lambda}u_x$，$\psi_y = \frac{2\pi d_y}{\lambda}u_y$ |
| **方向图与合成 / Pattern and Synthesis** | |
| $B(\psi_x,\psi_y)$ | 二维波束方向图（beampattern） |
| $B_d(\psi_x,\psi_y)$ | 期望二维方向图（desired beampattern） |
| $B_x(\psi_x), B_y(\psi_y)$ | 可分离方向图的 $x$、$y$ 一维因子 |
| $J_m(\cdot)$ | $m$ 阶第一类 Bessel 函数 |
| $\boldsymbol{V}(\psi_x,\psi_y)$ | 阵列流形矩阵（array manifold matrix） |
| $\text{vec}(\cdot)$ | 矩阵按列拉直为向量的操作 |
| $\mathbf{v}(\psi_x,\psi_y)$ | 阵列流形向量，$\mathbf{v} = \text{vec}[\boldsymbol{V}]$ |
| **圆阵 / Circular Array** | |
| $W_m$ | 第 $m$ 个相位模式的激励（phase-mode excitation） |
| $M$ | 有效相位模式数，$M \approx 2\pi R/\lambda$ |
| $\mathbf{B}_{PM}$ | 相位模式激励矩阵（phase-mode matrix） |
| $\mathbf{v}_{bs}(\theta,\phi)$ | 波束空间（相位模式域）阵列流形 |
| $\boldsymbol{J}(\cdot)$ | 对角 Bessel 矩阵 |
| **圆孔径 / Circular Aperture** | |
| $u_R = \frac{2R}{\lambda}\sin\theta$ | 圆孔径归一化波束变量 |
| $D_0(\theta)$ | 径向差方向图（radial difference pattern） |
| $D_\alpha, D_\beta$ | 方位 / 俯仰差波束（azimuth/elevation difference beams） |
| $R_0$ | Taylor 合成的主瓣旁瓣比 |
| **六边形阵列 / Hexagonal Array** | |
| $N_H$ | 六边形阵元总数 |
| $R_h$ | 六边形环数（number of rings） |
| $N_x$ | 最宽一行阵元数 |
| $\mathbf{v}_1, \mathbf{v}_0, \mathbf{v}_{-1}$ | 六边形阵列各行流形向量 |
| **优化与约束 / Optimization and Constraints** | |
| $\boldsymbol{C}_0$ | 二维零点约束矩阵（null-constraint matrix） |
| $\mathbf{P}_{\mathbf{C}_0}^\perp$ | 约束空间正交补上的投影矩阵 |

---

## 4.1 矩形阵列（Rectangular Arrays）

**几何结构。** 在 $x$ 方向排布 $N$ 个阵元、间距 $d_x$，在 $y$ 方向排布 $M$ 个阵元、间距 $d_y$，构成矩形网格，第 $(n,m)$ 个阵元位于 $(n d_x,\, m d_y)$。这是最自然的二维推广——把一维线阵沿垂直方向复制成网格。

> **定义 4.1**（均匀矩形阵列 / Uniform Rectangular Array, URA）：阵元位于矩形网格节点上的平面阵列，$x$、$y$ 方向阵元数分别为 $N$、$M$。间距取 $d_x = d_y = \lambda/2$ 时称为**标准矩形阵列**（standard rectangular array, SRA）。

**波束方向图。** 对 $x$、$y$ 方向入射角分别为 $(\theta,\phi)$ 的平面波，引入二维电角度

$$
\psi_x = \frac{2\pi d_x}{\lambda}\sin\theta\cos\phi, \qquad
\psi_y = \frac{2\pi d_y}{\lambda}\sin\theta\sin\phi,
$$

权重为 $w_{nm}$ 时的频率-波数响应为

$$
B(\psi_x,\psi_y) = e^{-j\left(\frac{N-1}{2}\psi_x + \frac{M-1}{2}\psi_y\right)}
\sum_{n=0}^{N-1}\sum_{m=0}^{M-1} w_{nm}^*\, e^{j(n\psi_x + m\psi_y)},
$$

这是一个**二维傅里叶变换**——与线阵情形完全对应，只是维度从一维变为二维。

> **定理 4.1**（可分离权值与方向图乘积）：若权值可分离，$w_{nm} = w_n w_m$（$x$、$y$ 方向独立设计），则方向图分解为两个一维方向图的乘积：
>
> $$
> B(\psi_x,\psi_y) = B_x(\psi_x)\, B_y(\psi_y).
> $$

> **例 4.1**（可分离方向图的旁瓣方向性）：可分离方向图在不同 $\phi$ 方向的旁瓣结构差异很大。例如 $\phi = 0^\circ$ 与 $\phi = 45^\circ$ 时旁瓣水平明显不同：$\phi = 45^\circ$ 方向上的旁瓣是两个一维方向图旁瓣的**乘积**，自然更低。这是可分离设计的固有代价——旁瓣随方位角变化，无法得到圆对称方向图。

![图 4.1：均匀加权 URA（N_x=10, N_y=8, d=λ/2）在 u 空间的二维波束方向图。白色单位圆为可视区域，× 号标出栅瓣网格位置（整数点 u_x=p, u_y=q）。](../pic/ch4_矩形阵列方向图.png)

**可视区域与栅瓣。** 在 $(u_x, u_y)$ 空间中，可视区域是**单位圆**：

$$
u_r = \sqrt{u_x^2 + u_y^2} \le 1.
$$

> **定理 4.2**（二维栅瓣网格与无栅瓣条件）：栅瓣出现在二维网格点上
>
> $$
> u_x = p\,\frac{\lambda}{d_x}, \qquad u_y = q\,\frac{\lambda}{d_y}, \qquad p,q = \pm 1, \pm 2, \ldots
> $$
>
> 波束扫描时整个栅瓣网格随之平移。为避免栅瓣进入可视区域，需
>
> $$
> \boxed{d_x \le \frac{\lambda}{1 + |\sin\theta_{\max}\cos\phi_{\max}|}, \qquad
> d_y \le \frac{\lambda}{1 + |\sin\theta_{\max}\sin\phi_{\max}|}}.
> $$

扫描范围与间距的权衡与一维（第 2.11 节）相同：只需求法向附近扫描时可用更大的 $d_x, d_y$；全半球扫描则需 $d_x = d_y = \lambda/2$。

**波束宽度与方向性。** 当阵列调向到 $(\theta_0,\phi_0)$ 时，两个正交平面内的半功率波束宽度近似为

$$
\theta_H = \frac{\theta_{x0}}{\cos\theta_0}\cdot
\frac{1}{\sqrt{\cos^2\phi_0 + \left(\frac{\theta_{x0}}{\theta_{y0}}\right)^2\sin^2\phi_0}},
\qquad
\phi_H = \frac{\phi_{y0}}{\sqrt{\sin^2\phi_0 + \left(\frac{\phi_{y0}}{\phi_{x0}}\right)^2\cos^2\phi_0}},
$$

其中 $\theta_{x0}$、$\phi_{y0}$ 分别是 $N$ 元、$M$ 元线阵的 HPBW。直观理解：波束从法向扫描时，在扫描平面内展宽（有效孔径缩短），在垂直平面内基本不变。

方向性定义为

$$
D = \frac{|\mathbf{w}^H \mathbf{v}(\theta_0,\phi_0)|^2}{\mathbf{w}^H \mathbf{B}\, \mathbf{w}},
\qquad
[\mathbf{B}]_{nm} = \operatorname{sinc}\!\left(\frac{2\pi}{\lambda}|\mathbf{p}_n - \mathbf{p}_m|\right),
$$

对大面积矩形阵列近似有

$$
D \approx \pi\cos\theta_0\, D_x D_y,
$$

其中 $D_x$、$D_y$ 为两方向线阵的方向性——二维阵列的方向性近似等于"两一维方向性之积 × 立体角因子"。

**阵列流形矩阵与 vec 操作。** 对平面阵列用矩阵表示流形更方便：

$$
[\boldsymbol{V}(\psi_x,\psi_y)]_{nm} = e^{j(n\psi_x + m\psi_y)},
$$

再用 $\text{vec}(\cdot)$ 操作把矩阵**按列拉直**成 $NM \times 1$ 向量：

$$
\mathbf{v}(\psi_x,\psi_y) = \text{vec}\!\left[\boldsymbol{V}(\psi_x,\psi_y)\right].
$$

之所以引入 $\text{vec}$：后续算法（MVDR、MUSIC 等）都以向量为对象，通过 $\text{vec}$ 把二维平面阵列纳入与一维阵列完全统一的数学框架。

**可分离谱加权。** 在 $x$、$y$ 方向分别采用一维窗函数：

$$
w_{nm} = w_n \cdot w_m.
$$

优点：设计简单，只需两个一维窗函数。缺点：旁瓣结构随 $\phi$ 方向变化，得不到**圆对称**方向图（旁瓣各方向相同）。

**二维 z 变换。** 与一维类似，定义 $z_1 = e^{j\psi_x}$、$z_2 = e^{j\psi_y}$：

$$
B(z_1,z_2) = \sum_{n=0}^{N-1}\sum_{m=0}^{M-1} w_{nm}\, z_1^{-n} z_2^{-m},
$$

这是一个二维多项式，零点分布在二维复平面上，**零点位置决定二维方向图形状**（第 3.2 节思想的直接推广）。

**最小二乘合成。**

> **定理 4.3**（二维最小二乘解）：给定期望方向图 $B_d(\psi_x,\psi_y)$，最小二乘误差意义下的最优权值为**二维 Fourier 级数系数**：
>
> $$
> \boxed{w_{nm,o} = \frac{1}{(2\pi)^2}\int_{-\pi}^{\pi}\int_{-\pi}^{\pi} B_d(\psi_x,\psi_y)\, e^{-j(n\psi_x + m\psi_y)}\,\mathrm{d}\psi_x\,\mathrm{d}\psi_y}.
> $$
>
> 例如期望方向图在某矩形区域内为 1、其余为 0，则权值正是二维 sinc 函数。

**圆对称加权与窗函数。** 许多应用要求旁瓣在所有方位角方向上水平相同，即方向图只依赖径向变量 $r = \sqrt{u_x^2+u_y^2}$，称为**圆对称方向图**。

> **定义 4.2**（圆对称方向图 / Circularly Symmetric Pattern）：方向图只依赖 $r = \sqrt{u_x^2+u_y^2}$、与方位角无关的二维方向图。实现条件：权值 $w_{nm}$ 只依赖 $\sqrt{n^2+m^2}$。

> **定理 4.4**（圆对称权值 = Hankel 变换）：圆对称方向图 $B_d(r)$ 与径向权值函数构成**零阶 Hankel 变换**对：
>
> $$
> w(r) = \frac{1}{2\pi}\int_0^\infty B_d(k)\, J_0(kr)\, k\,\mathrm{d}k,
> $$
>
> 其中 $J_0$ 为零阶 Bessel 函数。离散阵列的权值取采样 $w_{nm} = w\!\left(\sqrt{n^2+m^2}\right)$。
>
> 注意：圆对称权值必须在**所有阵元**（包括矩形网格角落）上计算，不能直接截断成圆形边界——截断会破坏圆对称性并抬高旁瓣。

**波数采样与二维 DFT。** 与一维完全对应：

$$
B(k_1,k_2) = \sum_{n=0}^{N-1}\sum_{m=0}^{M-1} b_{nm}\, e^{-j2\pi\left(\frac{k_1 n}{N} + \frac{k_2 m}{M}\right)},
\qquad
b_{nm} = \frac{1}{NM}\sum_{k_1=0}^{N-1}\sum_{k_2=0}^{M-1} B(k_1,k_2)\, e^{j2\pi\left(\frac{k_1 n}{N} + \frac{k_2 m}{M}\right)}.
$$

工程流程：(1) 在 $(\psi_x,\psi_y)$ 空间以 $2\pi/N$、$2\pi/M$ 为间隔采样期望方向图；(2) 二维 IDFT 得到 $b_{nm}$；(3) 乘以相位因子得到权值 $w_{nm}$；(4) 验证合成方向图。

**从一维到二维的变换（Tseng–Cheng）。** 若已有一个理想的一维方向图 $B_{1D}(\psi)$，可将其"旋转"成二维方向图。

> **定理 4.5**（Tseng–Cheng 变换）：作代换
>
> $$
> \cos\psi \to \cos\psi_x \cos\psi_y, \qquad
> B_{2D}(\psi_x,\psi_y) = B_{1D}(\psi), \quad \cos\psi = \cos\psi_x\cos\psi_y.
> $$
>
> 例：从一维 Chebychev 方向图得到二维 Chebychev 方向图
>
> $$
> B_{2D}(\psi_x,\psi_y) = T_{N-1}\!\left(x_0 \cos\frac{\psi_x}{2}\cos\frac{\psi_y}{2}\right),
> $$
>
> 在**任意 $\phi$ 方向的切面**上方向图都是 Chebychev 的——真正意义上的二维等旁瓣方向图。

**零点调向。** 与一维相同，可在二维空间的特定点 $(u_{x0}, u_{y0})$ 置零点：

$$
\mathbf{w}^H \mathbf{v}(u_{x0}, u_{y0}) = 0.
$$

对多个零点组成约束矩阵 $\boldsymbol{C}_0 = [\mathbf{v}(u_{x1},u_{y1}),\, \ldots,\, \mathbf{v}(u_{xM},u_{yM})]$，约束最小二乘解为

$$
\mathbf{w}_o^H = \mathbf{w}_d^H - \mathbf{w}_d^H \boldsymbol{C}_0\left[\boldsymbol{C}_0^H \boldsymbol{C}_0\right]^{-1}\boldsymbol{C}_0^H,
$$

即把理想权值投影到约束空间正交补上（第 3.7 节结论的二维形式）。物理意义：在二维频率-波数空间中任意点放置零点，抑制来自对应方向 $(u_x,u_y)$ 的干扰。

---

## 4.2 圆阵（Circular Arrays）

**圆阵的动机。** 矩形阵列有自然的"正方向"——$x$、$y$ 轴方向，信号来自 $45^\circ$ 方向时方向图行为与轴向不同。**圆阵全向对称**，所有方位角等价，适合需要全方位扫描的应用（雷达警戒、通信卫星多波束覆盖）。

**环形孔径的数学描述。** 半径为 $R$ 的圆环，阵元位于角度 $\phi$ 处，位置向量为

$$
\mathbf{p} = R[\cos\phi,\; \sin\phi]^T,
$$

入射平面波的波数为 $\mathbf{k} = k_0[\sin\theta\cos\phi_s,\; \sin\theta\sin\phi_s]^T$（$\phi_s$ 为信号方位角），相位项为

$$
\mathbf{k}^T\mathbf{p} = k_0 R \sin\theta \cos(\phi - \phi_s).
$$

**相位模式激励。** 这是圆阵最核心的概念。把环形孔径上的加权函数展开成关于方位角 $\phi$ 的 Fourier 级数：

> **定义 4.3**（相位模式 / Phase Mode）：环形加权函数 $w(\phi)$ 的 Fourier 展开项
>
> $$
> w(\phi) = \sum_{m=-\infty}^{\infty} W_m\, e^{jm\phi},
> $$
>
> 每一项 $W_m e^{jm\phi}$ 对应一个**相位模式**（phase mode）。

> **定理 4.6**（相位模式方向图）：第 $m$ 个模式产生的方向图为
>
> $$
> B_m(\theta,\phi) = W_m\, j^m J_m(k_0 R \sin\theta)\, e^{jm\phi},
> $$
>
> 其中 $J_m$ 为 $m$ 阶 Bessel 函数。Bessel 函数来自对 $\phi$ 的积分
>
> $$
> \int_0^{2\pi} e^{j k_0 R \sin\theta \cos(\phi-\phi_s)} e^{jm\phi}\,\mathrm{d}\phi
> = 2\pi j^m J_m(k_0 R \sin\theta)\, e^{jm\phi_s},
> $$
>
> 这是 Bessel 函数的积分表示。
>
> 有效模式数目受半径限制：$M \approx \dfrac{2\pi R}{\lambda}$——圆环周长越长，能支撑的"角向振荡"（模式）越多。

**相位模式波束形成器。** 一个 Butler 矩阵（DFT 矩阵）把 $N$ 个阵元输出转换为 $2M+1$ 个相位模式：

$$
\mathbf{x}_{PM} = \mathbf{B}_{PM}^H \mathbf{x},
$$

其中相位模式激励矩阵 $\mathbf{B}_{PM}$ 的第 $m$ 列为

$$
\mathbf{b}_m = \frac{1}{N}\left[1,\; e^{-jm\frac{2\pi}{N}},\; \ldots,\; e^{-jm(N-1)\frac{2\pi}{N}}\right]^T.
$$

> **定理 4.7**（相位模式：圆阵化为线阵）：在相位模式空间中，阵列流形化为
>
> $$
> \mathbf{v}_{bs}(\theta,\phi) = \boldsymbol{J}(k_0 R \sin\theta)\, \mathbf{v}_{ULA}(\phi),
> $$
>
> 其中 $\boldsymbol{J}$ 是对角 Bessel 矩阵，$\mathbf{v}_{ULA}(\phi)$ 是标准线阵的流形向量。
>
> **结论：先做相位模式变换，所有线阵的合成技术都可直接用于圆阵。**

**离散圆阵的采样条件。**

> **定理 4.8**（离散圆阵采样条件）：用离散阵元近似连续圆环，为避免空间混叠需
>
> $$
> N \ge 2M + 1,
> $$
>
> 代入 $M \approx 2\pi R/\lambda$ 得 $N \ge \dfrac{4\pi R}{\lambda} = \dfrac{2\pi D}{\lambda}$，等价于阵元弧长间距
>
> $$
> d = \frac{2\pi R}{N} \le \frac{\lambda}{2}.
> $$
>
> 与线阵 $d \le \lambda/2$ 一致——只是把直线间距换成**弧长间距**。

---

## 4.3 圆孔径（Circular Apertures）

圆环是一维的（只有角度方向），圆孔径是二维的（半径 $r$ 与角度 $\phi$ 两个方向）。圆孔径对应**抛物面天线**的孔径——雷达与通信中最常见的天线形式之一。

### 4.3.1 均匀照明的圆孔径

> **定理 4.9**（均匀圆孔径的 Airy 方向图）：孔径加权为常数（$w(r,\phi) = 1$）时，方向图由 Bessel 函数给出：
>
> $$
> \boxed{B(\theta) = \frac{2J_1(kR\sin\theta)}{kR\sin\theta}
> = \frac{2J_1(\pi u_R)}{\pi u_R}},
> \qquad u_R = \frac{2R}{\lambda}\sin\theta,
> $$
>
> 即著名的 **Airy 方向图**（光学中的 Airy 斑）。

![图 4.2：均匀圆孔径方向图 2J₁(x)/(x)（红）与均匀线阵方向图 sinc（蓝）对比。圆孔径第一旁瓣 -17.6 dB，明显低于线阵的 -13.3 dB。](../pic/ch4_圆孔径对比.png)

**与线阵的对比。**

**表 4.2** 均匀圆孔径与均匀线阵方向图对比

| 特征 | 线阵（均匀） | 圆孔径（均匀） |
| --- | --- | --- |
| 波束函数 | $\text{sinc}(\pi L u/\lambda)$ | $2J_1(\pi u_R)/(\pi u_R)$ |
| 第一零点 | $u = \lambda/L$ | $u_R = 1.22$ |
| 第一旁瓣 | $-13.3$ dB | $-17.6$ dB |
| HPBW | $0.89\,\lambda/L$ | $1.02\,\lambda/(2R)$ |

（数值经 MATLAB 复核：线阵第一旁瓣 $-$13.3 dB、圆孔径 $-$17.6 dB，两者相差约 $4$ dB。）

> **例 4.2**（圆孔径与线阵的旁瓣对比）：圆孔径第一旁瓣 $-17.6$ dB，比线阵的 $-13.3$ dB 低约 $4$ dB。原因：**圆对称形状自然地"圆滑"了边缘突变**，降低了旁瓣——在相同尺度下圆孔径比矩形/线阵孔径更"便宜"地获得低旁瓣。

### 4.3.2 圆孔径的 Taylor 合成

与一维 Taylor 分布完全平行，只是换成圆对称的二维情形。

> **定理 4.10**（圆孔径 Taylor 合成）：从均匀圆孔径方向图 $2J_1(\pi u)/(\pi u)$（零点在 $J_1$ 的零点 $u_n$）出发，把前 $\bar{n}-1$ 个零点移动到新位置
>
> $$
> u_n = \bar{n}\left[\frac{A^2 + \left(n - \frac{1}{2}\right)^2}{A^2 + \left(\bar{n} - \frac{1}{2}\right)^2}\right]^{1/2},
> $$
>
> 其中 $A = \frac{1}{\pi}\cosh^{-1}R_0$，$R_0$ 为主瓣旁瓣比。结果：得到旁瓣逐渐衰减的**圆对称方向图**。

### 4.3.3 差波束（二维单脉冲）

> **定理 4.11**（二维差波束）：对圆孔径，差波束有两个——方位差波束（$\cos\phi$ 加权）与俯仰差波束（$\sin\phi$ 加权）：
>
> $$
> D_\alpha(\theta,\phi) = 4\pi j\cos\phi\, D_0(\theta), \qquad
> D_\beta(\theta,\phi) = -4\pi j\sin\phi\, D_0(\theta),
> $$
>
> 其中 $D_0(\theta)$ 为径向差方向图。
>
> 物理意义：和波束给出目标存在信息，两个差波束分别给出 $x$、$y$ 方向的角误差——**二维单脉冲测角**的基础。

---

## 4.4 六边形阵列（Hexagonal Arrays）

**六边形网格的动机。** 矩形网格对**圆形带限区域**的采样并非最优：在二维空间中，采样一个圆形带限区域时**六边形（三角）网格**用最少的采样点达到同样的重建精度，且栅瓣分布更均匀，同样扫描范围内所需阵元数比矩形网格少约 $13.4\%$。

**六边形阵列的几何。** 阵元排列在等边三角形顶点上：水平间距 $d_x$，行间距 $d_y = \frac{\sqrt{3}}{2}d_x$。标准六边形阵列（SHA）取 $d_x = \lambda/2$，故 $d_y = \sqrt{3}\,\lambda/4$。

阵元总数由六边形**环数** $R_h$ 决定（最宽一行阵元数 $N_x = 2R_h + 1$）：

$$
N_H = 1 + 6\sum_{n=1}^{R_h} n = 1 + 3R_h(R_h+1).
$$

> **例 4.3**（六边形阵元数）：$R_h = 2$（最宽行 $N_x = 5$）时 $N_H = 19$；$R_h = 3$（$N_x = 7$）时 $N_H = 37$；$R_h = 5$（$N_x = 11$）时 $N_H = 91$。同样孔径下六边形网格比矩形网格少约 $13\%$ 的阵元。

**六边形阵列的方向图。** 阵列流形可写成行的形式：

$$
\mathbf{v}(\psi_x,\psi_y) = \text{vec}\begin{bmatrix} \mathbf{v}_1^T \\ \mathbf{v}_0^T \\ \mathbf{v}_{-1}^T \\ \vdots \end{bmatrix},
$$

均匀加权时方向图由各行方向图的叠加决定。

**六边形到矩形的变换。**

> **定理 4.12**（六边形 → 矩形坐标变换）：把六边形阵列映射到矩形网格，即可在矩形网格上使用已有的全部算法。坐标变换为
>
> $$
> \begin{bmatrix} v_x \\ v_y \end{bmatrix}
> = \begin{bmatrix} 1 & 0 \\ \frac{1}{2} & \frac{\sqrt{3}}{2} \end{bmatrix}
> \begin{bmatrix} u_x \\ u_y \end{bmatrix},
> \qquad
> \begin{bmatrix} u_x \\ u_y \end{bmatrix}
> = \begin{bmatrix} 1 & 0 \\ -\frac{1}{\sqrt{3}} & \frac{2}{\sqrt{3}} \end{bmatrix}
> \begin{bmatrix} v_x \\ v_y \end{bmatrix}.
> $$
>
> 含义：六边形阵列的处理可转换到 $v$ 空间按矩形阵列进行，最后把结果映射回 $u$ 空间。**本质上是把被"扭曲"的矩形网格还原**。

---

## 4.5 非平面阵列（Nonplanar Arrays）

**共形阵列的动机。** 许多平台上无法安装平面阵列：潜艇表面（共形于艇壳）、飞机机身、卫星表面等。**共形阵列**（conformal array）指传感器安装在弯曲表面上、与载体表面形状一致的阵列。

> **定义 4.4**（共形阵列 / Conformal Array）：阵元分布在弯曲载体表面上的阵列，几何服从载体外形，而非平面/直线规则布局。

**圆柱形阵列。** 多个圆环阵列沿 $z$ 轴堆叠构成圆柱阵。方向图为

$$
B(\theta,\phi) = \sum_{n=-(N-1)/2}^{(N-1)/2}\sum_{m=1}^{M} w_{nm}\,
e^{j k_0 \left[R\sin\theta\cos(\phi-\phi_m) + z_n\cos\theta\right]}.
$$

> **定理 4.13**（圆柱阵列的可分离性）：若权值可分离 $w_{nm} = w_n w_m$（沿轴线与沿圆周分别设计），方向图分解为两个一维方向图的乘积：
>
> $$
> B(\theta,\phi) = B_z(\theta)\, B_{\text{circ}}(\theta,\phi),
> $$
>
> 其中 $B_z$ 为轴线方向线阵方向图，$B_{\text{circ}}$ 为圆环方向图。

**球形阵列。** 传感器分布在球面上：

$$
B(\theta,\phi) = \sum_{n} w_n\,
e^{j k_0 R \left[\sin\theta\sin\theta_n\cos(\phi-\phi_n) + \cos\theta\cos\theta_n\right]}.
$$

优势：真正的**三维全覆盖**，可在任何方向形成波束。代价：阵元数量巨大、控制复杂。

---

## 4.6 本章总结

**表 4.3** 二维阵列类型对比

| 阵列类型 | 几何特点 | 数学工具 | 适用场景 |
| --- | --- | --- | --- |
| 矩形网格 | 规则，可分离 | 二维 DFT、可分离权值 | 大多数地面/机载雷达 |
| 圆形 / 环形 | 全向对称 | Bessel 函数、相位模式 | 全方位扫描、卫星通信 |
| 六边形 | 采样效率最高 | 六边形 → 矩形变换 | 空间受限但需高效率 |
| 共形（圆柱 / 球） | 弯曲表面 | 方向图乘积、相位模式扩展 | 潜艇、飞机、卫星共形 |

**贯穿本章的核心思想。** 平面阵列是线阵理论的二维扩展：

1. **傅里叶变换变二维**——方向图是权值的二维 DFT；
2. **栅瓣变二维网格**——要求 $d_x, d_y \le \lambda/2$；
3. **可分离权值简化设计**——但牺牲圆对称性；
4. **圆对称是更优的目标**——需要不可分离权值。

圆阵与六边形阵的两个特殊贡献：

5. **Bessel 函数代替 sinc 函数**——圆对称结构自然产生更低的旁瓣（均匀圆孔径 $-17.6$ dB vs 线阵 $-13.3$ dB）；
6. **相位模式变换**——把圆阵问题转化为线阵问题，线阵的全部合成技术得以复用；
7. **六边形采样效率最高**——用最少的阵元覆盖给定空域（比矩形网格少约 $13\%$）。

二维可视区域与栅瓣条件的本质与一维相同：$d_x, d_y \le \lambda/2$ 是二维化的空间奈奎斯特条件。圆对称方向图的数学基础是 Bessel 函数——对比 $J_1(x)/(x)$ 与 $\operatorname{sinc}(x)$ 即可抓住圆/矩形孔径的本质区别。相位模式激励与六边形-矩形变换是两类重要的"计算技巧"：前者把圆阵变成线阵，后者把六边形还原为矩形，都是先归约到已知问题再求解。
