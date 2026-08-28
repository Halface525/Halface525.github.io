---
data: 2026-08-28
tags:
  - 阵列处理
  - 信号处理
  - 参数估计
lastdate: 2026-08-28
auther: Halface
---
第 8 章建立了参数估计的**理论框架**：认识了性能极限（CRB），以及理论上最优的 ML 估计——它在大样本下能达到 CRB。但 ML 估计需要 **$D$ 维高维搜索**，计算量巨大，实际中不可行。本章寻找**计算简便且性能仍然良好**的实用算法。可以理解为：第 8 章给出性能的"世界纪录"与达到它的理论路径，第 9 章给出工程上可负担的实现方法。

对应的核心算法家族如下：

```
第 9 章的实用算法
├── 二次型算法（计算量小，性能一般）
│   ├── 波束搜索（Bartlett 波束形成器）
│   └── MVDR / Capon（性能更优）
├── 子空间算法（性能好，计算中等）← 本章重点
│   ├── MUSIC（多重信号分类）
│   ├── 最小范数（MUSIC 的变体）
│   └── ESPRIT（旋转不变技术）
├── 线性预测（传统方法，性能中等）
└── 波束空间算法（降维版）
```

对应原书第 9 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 9.1** 本章符号表（Notation）

| 符号 | 含义与说明 |
| --- | --- |
| **数据与子空间 / Data & Subspaces** | |
| $\mathbf{x}(k)$ | 第 $k$ 个快拍矢量（$N \times 1$） |
| $K$ | 快拍个数 |
| $N$ | 阵元数；$D$ 信号源个数 |
| $\hat{\mathbf{S}}_x$ | 采样谱矩阵 |
| $\mathbf{U}_s, \mathbf{\Lambda}_s$ | 信号子空间特征矢量矩阵 / 特征值对角阵 |
| $\mathbf{U}_n$ | 噪声子空间特征矢量矩阵 |
| $\mathbf{\phi}_i$ | 第 $i$ 个特征矢量 |
| $\sigma_w^2$ | 噪声功率 |
| **二次型算法 / Quadratic** | |
| $Q(\psi)$ | 零谱，$Q(\psi) = \mathbf{v}^H(\psi)\mathbf{G}\mathbf{v}(\psi)$ |
| $P_{Bartlett}(\psi)$ | 常规波束输出功率 |
| $P_{MVDR}(\psi)$ | MVDR / Capon 谱 |
| $q_k$ | 求根零谱多项式系数 |
| **子空间算法 / Subspace** | |
| $v(\psi)$ | 阵列流形矢量（线阵范德蒙结构） |
| $Q_{MUSIC}(\psi)$ | MUSIC 零谱 |
| $\mathbf{d}$ | 最小范数矢量 |
| $\mathbf{g}$ | $\hat{\mathbf{U}}_s$ 的第一行（$1 \times D$） |
| $\mathbf{V}_1, \mathbf{V}_2$ | 两个重叠子阵的阵列流形 |
| $\mathbf{\Phi}$ | 旋转矩阵，$\mathbf{\Phi} = \mathrm{diag}(e^{j\psi_1},\ldots,e^{j\psi_D})$ |
| $\mathbf{\Psi} = \mathbf{T}^{-1}\mathbf{\Phi}\mathbf{T}$ | 子阵流形的相似变换 |
| $\mathbf{Q}$（酉阵） | 稀疏酉变换矩阵 |
| $\mathbf{W}$ | ESPRIT 行加权矩阵 |
| **线性预测 / LP** | |
| $a(m), p$ | 预测系数 / 阶数；$e(n)$ 预测误差 |
| **渐近 / Asymptotics** | |
| $P_D$ | 分辨概率 |
| $MSE_{local}, MSE_{global}$ | 局部 / 全局（野值）均方误差 |
| $h(\psi_i)$ | $\mathbf{d}^H\mathbf{U}_n\mathbf{U}_n^H\mathbf{d}$ |
| $ASNR_{threshold}$ | 分辨门限对应的阵列信噪比 |
| **空间平滑 / Spatial Smoothing** | |
| $L, M = N-L+1$ | 子阵个数 / 子阵元数 |
| $\hat{\mathbf{S}}_x^{(i)}$ | 第 $i$ 个子阵采样协方差 |
| $\mathbf{J}$ | 交换矩阵 |
| $\hat{\mathbf{S}}_{ss}, \hat{\mathbf{S}}_{fbss}$ | 前向 / 前后向空间平滑矩阵 |
| **波束空间 / Beamspace** | |
| $\mathbf{B}_{bs}, N_{bs}$ | 波束空间矩阵 / 维数 |
| **平面阵列 / Planar** | |
| $\mathbf{\Phi}_x, \mathbf{\Phi}_y$ | 两方向的旋转矩阵 |
| $\mathbf{J}_{bs}$ | 波束空间带状矩阵 |

---

## 9.1 二次型估计算法

### 9.1.1 二次型算法的共同形式

二次型算法的共同特点是：构造一个函数 $Q(\psi)$，它是 $\mathbf{v}(\psi)$ 的**二次型**，然后在 $\psi$ 空间搜索 $D$ 个最小值（或最大值）作为 DOA 估计：
$$
Q(\psi) = \mathbf{v}^H(\psi)\,\mathbf{G}\,\mathbf{v}(\psi),
$$
不同算法只是矩阵 $\mathbf{G}$ 不同。

### 9.1.2 波束搜索（Bartlett）

**这是最简单的 DOA 估计方法。** 把常规波束形成器在 $\psi$ 空间扫描，输出功率最大的 $D$ 个位置即 DOA 估计：
$$
P_{Bartlett}(\psi) = \mathbf{v}^H(\psi) \hat{\mathbf{S}}_x \mathbf{v}(\psi) = \frac{1}{K}\sum_{k=1}^{K}\left|\mathbf{v}^H(\psi)\mathbf{x}(k)\right|^2.
$$
物理意义：对每个可能的 $\psi$，用指向该方向的常规波束处理数据，输出功率反映该方向是否存在信号。

**局限。** 分辨率受**瑞利限**限制——两个信号间隔小于波束宽度时无法分辨；旁瓣会掩盖弱信号。可以通过加窗（如 Hamming）压低旁瓣，但会**加宽主瓣**、降低分辨率。

### 9.1.3 MVDR（Capon）算法

用 **MVDR 波束形成器**代替常规波束形成器扫描：
$$
P_{MVDR}(\psi) = \frac{1}{\mathbf{v}^H(\psi)\hat{\mathbf{S}}_x^{-1}\mathbf{v}(\psi)}.
$$
MVDR 在每个 $\psi$ 方向都**自适应地抑制了其他方向的干扰**，因而谱峰更尖锐、分辨率更高。实际使用中通常画零谱 $Q_{MVDR}(\psi) = \mathbf{v}^H(\psi)\hat{\mathbf{S}}_x^{-1}\mathbf{v}(\psi)$，找 $D$ 个最小值。

### 9.1.4 求根 MVDR（线阵专用）

对标准线阵，$\mathbf{v}(\psi) = [1, e^{j\psi}, \ldots, e^{j(N-1)\psi}]^T$，零谱 $Q_{MVDR}(\psi)$ 是 $e^{j\psi}$ 的多项式：
$$
Q(z) = \sum_{k=-(N-1)}^{N-1} q_k\,z^k, \quad z = e^{j\psi}.
$$
在单位圆上搜索最小值，等价于找多项式 $Q(z)$ 在单位圆**附近**的根。

**求根 MVDR 步骤。** (1) 构造多项式 $Q(z)$；(2) 求根；(3) 选择单位圆内**最接近单位圆**的 $D$ 个根；(4) 根的相位即 $\psi$ 的估计。

**求根优于谱搜索的原因。** 谱搜索在离散点计算，离散化带来误差；求根在连续域直接求解，精度更高且计算量更小。求根 MVDR 在门限以上接近 CRB，门限比谱搜索 MVDR 低约 5–8 dB。

---

## 9.2 子空间算法（现代 DOA 估计核心）

### 9.2.1 子空间正交性原理

回顾第 5 章：对 $D$ 个信号加白噪声，空间谱矩阵的特征分解为
$$
\mathbf{S}_x = \mathbf{U}_s\mathbf{\Lambda}_s\mathbf{U}_s^H + \sigma_w^2\mathbf{U}_n\mathbf{U}_n^H,
$$
其中 $\mathbf{U}_s = [\mathbf{\phi}_1,\ldots,\mathbf{\phi}_D]$ 为**信号子空间**，$\mathbf{U}_n = [\mathbf{\phi}_{D+1},\ldots,\mathbf{\phi}_N]$ 为**噪声子空间**。

**最关键的性质。** 阵列流形矢量 $\mathbf{v}(\psi_i)$ 与噪声子空间**正交**：
$$
\mathbf{v}^H(\psi_i)\,\mathbf{U}_n = \mathbf{0}, \quad i = 1,2,\ldots,D.
$$

> **定义 9.1**（子空间算法的通用步骤）：
>
> 1. 从数据估计 $\hat{\mathbf{S}}_x$；
> 2. 特征分解，得到 $\hat{\mathbf{U}}_s$ 或 $\hat{\mathbf{U}}_n$；
> 3. 构造零谱 $Q(\psi) = \mathbf{v}^H(\psi)\hat{\mathbf{U}}_n\hat{\mathbf{U}}_n^H\mathbf{v}(\psi)$；
> 4. 找 $Q(\psi)$ 的 $D$ 个最小值作为 DOA 估计。

### 9.2.2 MUSIC 算法

**谱搜索 MUSIC。** 零谱为
$$
Q_{MUSIC}(\psi) = \mathbf{v}^H(\psi)\hat{\mathbf{U}}_n\hat{\mathbf{U}}_n^H\mathbf{v}(\psi) = \sum_{i=D+1}^{N}\left|\mathbf{v}^H(\psi)\hat{\mathbf{\phi}}_i\right|^2,
$$
即 $\mathbf{v}(\psi)$ 到噪声子空间的投影能量。当 $\psi$ 等于真实信号方向时，理论上投影能量为零。实际中画 $1/Q_{MUSIC}(\psi)$ 的谱，找 $D$ 个峰值。名称 MUSIC 取自 **MU**ltiple **SI**gnal **C**lassification。

**求根 MUSIC（线阵高效版）。** 把 MUSIC 零谱写成多项式：
$$
Q_{MUSIC}(z) = \mathbf{v}^T(z^{-1})\hat{\mathbf{U}}_n\hat{\mathbf{U}}_n^H\mathbf{v}(z), \quad \mathbf{v}(z) = [1, z, \ldots, z^{N-1}]^T.
$$
与谱搜索 MUSIC 具有**相同的渐近方差**，但**门限低得多**。原因：谱搜索在单位圆上采样，误差的径向分量会扭曲谱形状而抬高门限；求根直接求解、不受径向误差影响。

**酉阵求根 MUSIC。** 对共轭对称阵列（如标准线阵），用酉变换把复矩阵变实：
$$
\hat{\mathbf{S}}_{x,Re} = \mathbf{Q}^H \hat{\mathbf{S}}_{x,fb}\,\mathbf{Q},
$$
其中 $\mathbf{Q}$ 为稀疏酉矩阵（见 §7.2.3）。好处：运算全为**实数**（计算量约减 75%）、数值稳定性更好，性能与 FB 求根 MUSIC 相同。

### 9.2.3 最小范数算法

**核心思想。** 不用全部噪声特征矢量，只用它们的线性组合构造一个**最小范数矢量** $\mathbf{d}$：
$$
\mathbf{d} = \arg\min \|\mathbf{d}\|^2 \quad \text{s.t.} \quad \mathbf{d}^H\mathbf{U}_s = \mathbf{0},\ d_1 = 1.
$$

> **定理 9.1**（最小范数矢量解）：
>
> $$
> \mathbf{d} = \begin{bmatrix} 1 \\ \mathbf{d}' \end{bmatrix}, \qquad \mathbf{d}' = -\frac{\hat{\mathbf{U}}_s\,\mathbf{g}^*}{1-\mathbf{g}^H\mathbf{g}},
> $$
>
> 其中 $\mathbf{g}$ 是 $\hat{\mathbf{U}}_s$ 的第一行（$1 \times D$ 矢量）。

最小范数零谱：$Q_{MN}(\psi) = |\mathbf{v}^H(\psi)\mathbf{d}|^2$。最小范数通常比 MUSIC 分辨率略好，但渐近方差稍大。

### 9.2.4 ESPRIT 算法（旋转不变技术）

**原理。** ESPRIT（**E**stimation of **S**ignal **P**arameters via **R**otational **I**nvariance **T**echniques）把阵列分成两个相同子阵，第二个子阵相对第一个平移 $\Delta$。对标准线阵，取前 $N-1$ 个阵元为子阵 1、后 $N-1$ 个阵元为子阵 2（重叠）。

**关键关系。** 两个子阵的阵列流形满足
$$
\mathbf{V}_2 = \mathbf{V}_1 \mathbf{\Phi}, \quad \mathbf{\Phi} = \mathrm{diag}(e^{j\psi_1},\ldots,e^{j\psi_D}),
$$
$\mathbf{\Phi}$ 为**旋转矩阵**。子阵 2 的第 $i$ 个信号相对子阵 1 有相位差 $\psi_i$，故两个子阵流形只差一个对角相位矩阵。

**从数据到 $\mathbf{\Phi}$。** 信号子空间 $\mathbf{U}_s$ 与 $\mathbf{V}$ 张成同一空间：$\mathbf{U}_s = \mathbf{V}\mathbf{T}$。故
$$
\mathbf{U}_{s2} = \mathbf{U}_{s1}\mathbf{\Psi}, \quad \mathbf{\Psi} = \mathbf{T}^{-1}\mathbf{\Phi}\mathbf{T}.
$$

> **定理 9.2**（ESPRIT 的关键洞察）：$\mathbf{\Psi}$ 与 $\mathbf{\Phi}$ 是相似矩阵，**具有相同特征值**。因此只需估计 $\hat{\mathbf{U}}_s$、分成 $\hat{\mathbf{U}}_{s1}/\hat{\mathbf{U}}_{s2}$，解 $\hat{\mathbf{U}}_{s1}\hat{\mathbf{\Psi}} = \hat{\mathbf{U}}_{s2}$，求 $\hat{\mathbf{\Psi}}$ 的特征值 $\lambda_i$ 即可得 $\psi_i = \arg(\lambda_i)$。

**LS 与 TLS-ESPRIT。** 最小二乘解为
$$
\hat{\mathbf{\Psi}}_{LS} = \left(\hat{\mathbf{U}}_{s1}^H\hat{\mathbf{U}}_{s1}\right)^{-1}\hat{\mathbf{U}}_{s1}^H\hat{\mathbf{U}}_{s2}.
$$
总体最小二乘（TLS）同时考虑 $\hat{\mathbf{U}}_{s1}$ 与 $\hat{\mathbf{U}}_{s2}$ 的误差，门限性能更好；两者渐近方差相同。

**酉阵 ESPRIT。** 与酉阵 MUSIC 类似，用酉变换把复矩阵变实后做实数 ESPRIT。对子阵**行加权**可显著改善渐近方差、使其接近 CRB：
$$
\mathbf{W} = \mathrm{diag}(1, \sqrt{2}, \ldots, \underbrace{\sqrt{m_s},\ldots,\sqrt{m_s}}_{m_s}, \ldots, \sqrt{2}, 1),
$$
最优 $m_s$ 取决于信号位置。

### 9.2.5 算法性能比较

**表 9.2** 子空间/二次型算法性能比较

| 算法 | 计算复杂度 | 分辨率门限 | 渐近方差 | 优点 |
| --- | --- | --- | --- | --- |
| 谱搜索 MUSIC | 高（需扫描） | 较高 | 接近 CRB | 任意阵列可用 |
| 求根 MUSIC | 低（多项式求根） | 较低 | 接近 CRB | 线阵专用，精度高 |
| 最小范数 | 中等 | 较低 | 略高于 CRB | 分辨能力好 |
| LS-ESPRIT | 低 | 中等 | 接近 CRB（加权后） | 不需要扫描 |
| TLS-ESPRIT | 低 | 较好 | 接近 CRB（加权后） | 比 LS 更鲁棒 |
| 酉阵 ESPRIT | 最低（实数运算） | 最好 | 接近 CRB | 计算效率最高 |

**经验排序（非相关信号）。** 酉阵 TLS-ESPRIT（行加权，综合最优）→ 求根 MUSIC（经典选择）→ 最小范数 → 谱搜索 MUSIC（最简单但门限最高）。

![图 9.1：Bartlett / MVDR / MUSIC 谱对比——两近间距信号，MVDR 谱峰更尖锐，MUSIC 峰值孤立。](../pic/ch9_MUSIC谱.png)

---

## 9.3 线性预测

线性预测是**传统谱估计方法**在阵列上的应用：用前面阵元的线性组合预测后面阵元，预测误差的功率谱在信号方向有零点：
$$
x(n) = -\sum_{m=1}^{p} a(m)\,x(n-m) + e(n).
$$
当 $p = D$（信号个数）时，预测误差滤波器的零点在 $e^{j\psi_i}$ 处。其性能不如 MUSIC/ESPRIT，但计算简单。

---

## 9.4 渐近性能分析

渐近分析（$K \to \infty$）给出闭式表达式，是理解算法优劣、指导改进的基础。

### 9.4.1 分辨概率与 MSE 的关系

在门限区域，MSE 可分解为
$$
MSE = P_D \cdot MSE_{local} + (1-P_D) \cdot MSE_{global},
$$
其中 $P_D$ 为分辨概率（两信号被正确区分的概率），$MSE_{local}$ 为正确区分时的均方误差（≈CRB），$MSE_{global}$ 为未正确区分时的均方误差（很大）。

> **定理 9.3**（门限现象）：门限出现在 $P_D$ 从 1 开始下降处。在 $0.95 < P_D < 1$ 的范围内，MSE 急剧上升——这是几乎所有非线性参数估计问题的共同特征（第 8 章 AML 也观察到类似门槛效应）。

### 9.4.2 MUSIC 的分辨概率

当两信号间隔为 $\Delta\psi$ 时，MUSIC 的分辨门限近似为
$$
ASNR_{threshold} \approx \frac{1}{\Delta\psi^2 \cdot K}\cdot\text{常数}.
$$
物理意义：信号间隔越小、快拍越少，所需 SNR 越高；阵元越多，所需 SNR 越低。

### 9.4.3 小误差性能

当 $P_D \approx 1$ 时，MUSIC 的渐近方差为
$$
\mathrm{Var}_{MUSIC}(\psi_i) \approx \frac{\sigma_w^2}{2K}\cdot\frac{1}{h(\psi_i)}\left(1+\frac{1}{ASNR_i}\right),
$$
其中 $h(\psi_i) = \mathbf{d}^H(\psi_i)\mathbf{U}_n\mathbf{U}_n^H\mathbf{d}(\psi_i)$。与 CRB 相比：
$$
\frac{\mathrm{Var}_{MUSIC}}{\mathrm{CRB}} \approx 1 + \frac{1}{ASNR_i}.
$$
高 SNR 时 MUSIC 接近 CRB。行加权后的 ESPRIT 亦满足 $\mathrm{Var}_{ESPRIT}/\mathrm{CRB} \approx 1 + \text{小项}$，同样接近 CRB。

![图 9.2：求根 MUSIC 与谱搜索 MUSIC 的 RMSE vs SNR——求根版门限更低（约 5–8 dB），高 SNR 段两者均逼近 CRB。](../pic/ch9_求根vs谱搜索.png)

![图 9.3：酉阵 TLS-ESPRIT（行加权）/ MUSIC / CRB 的 RMSE vs SNR——加权 ESPRIT 接近 CRB。](../pic/ch9_ESPRIT_vs_CRB.png)

---

## 9.5 相关和相干信号——空间平滑

### 9.5.1 问题的根源

当信号相干（$|\rho|=1$）时，$\mathbf{S}_f$ 的秩 $< D$，信号子空间维数小于信号个数。MUSIC/ESPRIT 假设信号子空间维数等于信号个数，因而在相干信号下**失效**。

### 9.5.2 空间平滑（SS）

**核心思想。** 用多个重叠子阵的协方差矩阵**平均**，降低信号间的相干性。

**前向空间平滑。**
$$
\hat{\mathbf{S}}_{ss} = \frac{1}{L}\sum_{i=1}^{L}\hat{\mathbf{S}}_x^{(i)}, \quad M = N-L+1,
$$
其中 $\hat{\mathbf{S}}_x^{(i)}$ 是第 $i$ 个子阵（$M$ 个阵元）的采样协方差。

**前后向空间平滑（FBSS）。**
$$
\hat{\mathbf{S}}_{fbss} = \frac{1}{2L}\sum_{i=1}^{L}\left[\hat{\mathbf{S}}_x^{(i)} + \mathbf{J}\left(\hat{\mathbf{S}}_x^{(i)}\right)^*\mathbf{J}\right].
$$

> **定理 9.4**（空间平滑的去相干）：子阵平移改变了相干信号的**相对相位**，对多个子阵平均后相关项被"平均掉"。需要 $L \ge D/2$ 个子阵方可去相干。

**代价。** 有效阵元数从 $N$ 降到 $M = N-L+1$，分辨率下降——这是以孔径换稳健的必要折中。

---

## 9.6 波束空间算法

**核心思想。** 先做波束空间变换 $\mathbf{x}_{bs} = \mathbf{B}_{bs}^H\mathbf{x}$，再在低维空间做 MUSIC/ESPRIT。

**波束空间 MUSIC。**
$$
\mathbf{v}_{bs}(\psi) = \mathbf{B}_{bs}^H\mathbf{v}(\psi), \quad \hat{\mathbf{S}}_{x,bs} = \mathbf{B}_{bs}^H\hat{\mathbf{S}}_x\mathbf{B}_{bs},
$$
$$
Q_{bs\text{-}MUSIC}(\psi) = \mathbf{v}_{bs}^H(\psi)\hat{\mathbf{U}}_{n,bs}\hat{\mathbf{U}}_{n,bs}^H\mathbf{v}_{bs}(\psi).
$$

**好处。** 计算量从 $O(N^3)$ 降到 $O(N_{bs}^3)$；波束区域外的干扰被预先抑制；等效快拍更多、收敛更快。

**DFT 波束空间。** 用常规波束（Butler 矩阵）构成 $\mathbf{B}_{bs}$，最简单常用。**波束空间求根 MUSIC** 需构造能在波束空间求根的多项式（用带状 Toeplitz 矩阵变换）。

---

## 9.7 灵敏度和稳健性

**问题。** 实际阵列总有误差：阵元位置误差、增益/相位误差。当阵列有误差时，$\mathbf{v}(\psi)$ 与真实值 $\mathbf{v}_{true}(\psi)$ 有偏差，MUSIC/ESPRIT 的性能**严重下降**。

**影响。** 偏差增加（估计偏离真实值）、方差增加、门限升高。

**稳健化方法。**
1. **对角加载**：在 $\hat{\mathbf{S}}_x$ 上加 $\alpha\mathbf{I}$，降低噪声特征矢量的影响；
2. **特征空间修正**：把导向矢量投影到信号子空间；
3. **联合估计**：同时估计 DOA 与阵列误差参数（自校准）。

---

## 9.8 平面阵列（二维 DOA 估计）

对矩形阵列，需同时估计 $(\theta,\phi)$（或 $(u_x,u_y)$）。

**方法 1：配对的一维求根。** 用所有行的数据估计 $u_x$，用所有列的数据估计 $u_y$，再配对（计算二维 MUSIC 谱，选最小的几个点）。

**方法 2：二维酉阵 ESPRIT。** 把矩形阵列看成两个方向上的平移不变结构：
$$
\mathbf{V}_x = \mathbf{V}\mathbf{\Phi}_x, \quad \mathbf{V}_y = \mathbf{V}\mathbf{\Phi}_y,
$$
其中 $\mathbf{\Phi}_x = \mathrm{diag}(e^{j\psi_{x1}},\ldots,e^{j\psi_{xD}})$，$\mathbf{\Phi}_y$ 类似。步骤：(1) 估计二维信号子空间 $\hat{\mathbf{U}}_s$；(2) 分别求解 $u_x$、$u_y$ 方向的旋转矩阵；(3) 求 $\mathbf{\Phi}_x + j\mathbf{\Phi}_y$ 的特征值；(4) 从特征值同时得到 $(u_x, u_y)$。优点：实际为 $\mathbf{\Phi}_x + j\mathbf{\Phi}_y$ 的特征分解，**自动配对**，无需后处理。

---

## 9.9 本章总结

**从 ML 到实用算法的完整路径。** 第 8 章给出理论最优的 ML 估计（计算昂贵）；第 9 章给出实用算法：二次型（Bartlett/MVDR，简单）、子空间（MUSIC/最小范数/ESPRIT，性能好）、波束空间（降维），并对相干信号做空间平滑预处理。

**算法选择指南**

**表 9.3** 算法选择指南

| 场景 | 推荐算法 | 理由 |
| --- | --- | --- |
| 非相关信号，标准线阵 | 酉阵 TLS-ESPRIT（行加权） | 计算效率最高，性能接近 CRB |
| 非相关信号，任意阵列 | 谱搜索 MUSIC | 求根 MUSIC 不可用，通用 |
| 信号相干 | FBSS + 求根 MUSIC/ESPRIT | 需空间平滑预处理 |
| 信号个数未知 | AIC/MDL + MUSIC | 先检测 $D$ 再估计 |
| 阵列有误差 | 对角加载 + MUSIC/ESPRIT | 提高稳健性 |
| 计算资源受限 | 波束空间算法 | 降维 |

**核心公式速查**

**表 9.4** 核心公式速查

| 算法 | 公式 | 关键点 |
| --- | --- | --- |
| 谱搜索 MUSIC | $Q = \mathbf{v}^H\hat{\mathbf{U}}_n\hat{\mathbf{U}}_n^H\mathbf{v}$ | 找 $D$ 个最小值 |
| 求根 MUSIC | $Q(z) = \mathbf{v}^T(z^{-1})\hat{\mathbf{U}}_n\hat{\mathbf{U}}_n^H\mathbf{v}(z)$ | 找单位圆内最近根 |
| LS-ESPRIT | $\hat{\mathbf{\Psi}} = (\hat{\mathbf{U}}_{s1}^H\hat{\mathbf{U}}_{s1})^{-1}\hat{\mathbf{U}}_{s1}^H\hat{\mathbf{U}}_{s2}$ | 求特征值 |
| 空间平滑 | $\hat{\mathbf{S}}_{fbss} = \frac{1}{2L}\sum_i[\hat{\mathbf{S}}_x^{(i)} + \mathbf{J}(\hat{\mathbf{S}}_x^{(i)})^*\mathbf{J}]$ | 去相干 |

**核心结论。** (1) **MUSIC 是子空间算法的入门钥匙**——理解了信号子空间与噪声子空间的正交性就把握了子空间方法的精髓；(2) **求根优于谱搜索**——线阵下精度更高、门限更低，能用求根就用求根；(3) **ESPRIT 快但不总是更好**——不需扫描，但要求阵列具平移不变性（标准线阵恰好满足）；(4) **空间平滑以孔径换稳健**——为处理相干信号牺牲有效阵元数，是必要折中；(5) **波束空间不损失性能**——信号在波束区域内时 CRB 几乎不变，而计算量大减；(6) **门限现象真实存在**——任何算法都有 SNR 门限，门限以下出现野值、MSE 急剧上升，系统设计须保证工作点在门限以上。

**与后续内容及第 8 章的联系。** 第 8 章为基础、第 9 章为实现：ML 是理论最优但昂贵，MUSIC/ESPRIT 等在典型条件下逼近 CRB；二者共同构成阵列测角（DOA 估计）的完整工具箱，也是毫米波 MIMO 混合波束成形中测角环节的理论基础。
