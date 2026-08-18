---
data: 2026-08-17
tags:
  - 阵列处理
  - 信号处理
  - 参数估计
lastdate: 2026-08-17
auther: Halface
---
前面各章假设**信号方向已知**：第 2–4 章给定阵列几何设计权值得到期望方向图，第 6–7 章给定信号方向估计其波形。本章转向一个不同的问题——**信号来自何方是未知的，要从观测数据中把它推断出来**。这就是参数估计，更具体地说是**波达方向（DOA）估计**：信号模型中的未知参数是波数 $\mathbf{k}$（或方向角 $(\theta,\phi)$），我们需要从 $K$ 个快拍中估计它们。

快照模型：
$$
\mathbf{x}(k) = \mathbf{v}(\boldsymbol{\psi})\,F(k) + \mathbf{n}(k), \quad k = 1,2,\ldots,K,
$$
其中 $\boldsymbol{\psi}$ 是包含 $D$ 个信号 DOA 的矢量。核心问题：**给定 $K$ 个快拍，估计 $\boldsymbol{\psi}$**。

这个问题需要两章来处理，分工明确：第 8 章建立**理论基础**——什么是最优估计、性能极限在哪里（CRB）、最大似然估计如何推导；第 9 章介绍**实用算法**（MUSIC、ESPRIT、最小模等），在计算上更简单。可以理解为：第 8 章给出性能的"世界纪录"与达到它的理论路径，第 9 章给出工程上可负担的近似实现。对应原书第 8 章。以下为本章主要符号表。

## 本章符号表（Notation）

**表 8.1** 本章符号表（Notation）

| 符号 | 含义与说明 |
| --- | --- |
| **观测与数据 / Data** | |
| $\mathbf{x}(k)$ | 第 $k$ 个快拍矢量（$N \times 1$） |
| $K$ | 快拍个数 |
| $N$ | 阵元数 |
| $\hat{\mathbf{S}}_x$ | 采样谱矩阵，$\hat{\mathbf{S}}_x = \frac{1}{K}\sum_k \mathbf{x}(k)\mathbf{x}^H(k)$ |
| **信号与参数 / Signals & Parameters** | |
| $D$ | 信号源个数 |
| $\boldsymbol{\psi}$ | 波数/DOA 参数矢量，$\boldsymbol{\psi} = [\psi_1,\ldots,\psi_D]^T$ |
| $\mathbf{v}(\psi)$ | 阵列流形矢量 |
| $\mathbf{V}(\boldsymbol{\psi})$ | 阵列流形矩阵，$\mathbf{V} = [\mathbf{v}(\psi_1),\ldots,\mathbf{v}(\psi_D)]$，$N \times D$ |
| $\mathbf{f}(k)$ | 源信号矢量（$D \times 1$） |
| $\mathbf{n}(k)$ | 噪声矢量，$E[\mathbf{n}\mathbf{n}^H] = \sigma_w^2\mathbf{I}$ |
| $\sigma_w^2$ | 噪声功率 |
| $\mathbf{S}_f$ | 信号谱矩阵（$D \times D$，随机信号时） |
| $\mathbf{S}_x, \mathbf{R}_x$ | 观测谱矩阵，$\mathbf{R}_x = \mathbf{V}\mathbf{S}_f\mathbf{V}^H + \sigma_w^2\mathbf{I}$ |
| $ASNR$ | 阵列信噪比，$ASNR = N\,S_f/\sigma_w^2$ |
| **估计理论 / Estimation Theory** | |
| $\boldsymbol{\theta}$ | 一般参数矢量（回顾部分） |
| $p(\mathbf{x};\boldsymbol{\theta})$ | 似然函数（$\boldsymbol{\theta}$ 非随机） |
| $p(\mathbf{x}\|\boldsymbol{\theta}), p(\boldsymbol{\theta})$ | 条件密度 / 先验密度（$\boldsymbol{\theta}$ 随机） |
| $\mathbf{J}$ | Fisher 信息矩阵（FIM） |
| $\mathrm{CRB}(\theta_i)$ | 克拉美劳界，$\mathrm{CRB}(\theta_i) = [\mathbf{J}^{-1}]_{ii}$ |
| **CRB / CRB** | |
| $\mathbf{D}$ | 流形导数矩阵，$\mathbf{D} = [\mathrm{d}\mathbf{v}/\mathrm{d}\psi_1, \ldots, \mathrm{d}\mathbf{v}/\mathrm{d}\psi_D]$ |
| $\mathbf{P}_V$ | 到信号子空间的正交投影，$\mathbf{P}_V = \mathbf{V}(\mathbf{V}^H\mathbf{V})^{-1}\mathbf{V}^H$ |
| $\mathbf{P}_V^\perp$ | 到信号子空间正交补的投影，$\mathbf{P}_V^\perp = \mathbf{I} - \mathbf{P}_V$ |
| $\odot$ | Hadamard 积（对应元素相乘） |
| $\Delta u$ | 两信号归一化间隔，$\Delta u = \|\psi_1-\psi_2\|/\pi$ |
| $\rho, \phi_\rho$ | 信号相关系数及其相位 |
| **ML 估计 / ML** | |
| $\hat{\mathbf{S}}_f(\boldsymbol{\psi})$ | 固定 $\boldsymbol{\psi}$ 时信号谱的 ML 解 |
| $\hat{\sigma}_w^2(\boldsymbol{\psi})$ | 固定 $\boldsymbol{\psi}$ 时噪声功率的 ML 解 |
| $\mathbf{V}^\dagger$ | 伪逆，$\mathbf{V}^\dagger = (\mathbf{V}^H\mathbf{V})^{-1}\mathbf{V}^H$ |
| $\hat{\mathbf{U}}_s$ | 信号子空间特征矢量矩阵 |
| $\mathbf{\Lambda}_s$ | 信号特征值对角阵，$\mathbf{\Lambda}_s = \mathrm{diag}(\lambda_1,\ldots,\lambda_D)$ |
| $\mathbf{W}$ | WSF 加权矩阵 |
| **计算方法 / Computation** | |
| $F(\boldsymbol{\psi}), \mathbf{g}, \mathbf{H}$ | 代价函数 / 梯度 / Hessian |
| $\mu_k$ | 迭代步长 |
| $\mathbf{b}$ | 多项式系数矢量，$\mathbf{b} = [b_1,\ldots,b_D]^T$ |
| $\mathbf{Q}$ | 多项式二次型矩阵（IQML/MODE） |
| **阵列参数 / Array Perturbations** | |
| $\mathbf{p}$ | 未知阵列参数（位置/增益/相位误差） |
| $\mathbf{J}_{\psi\psi}, \mathbf{J}_{\psi p}, \mathbf{J}_{pp}$ | 混合 Fisher 信息子矩阵 |
| $N_{bs}$ | 波束空间维数 |

---

## 8.1 估计理论基础（ML、MAP 与 CRB）

进入阵列 DOA 估计之前，先回顾**估计理论的基本框架**。核心概念有三个：最大似然（ML）、最大后验（MAP）与克拉美劳界（CRB）——前两者给出估计准则，后者给出所有无偏估计的性能极限。

**最大似然估计（ML）。** 假设观测 $\mathbf{x}$ 依赖于未知参数 $\boldsymbol{\theta}$，似然函数 $p(\mathbf{x};\boldsymbol{\theta})$ 是给定 $\boldsymbol{\theta}$ 时观测到 $\mathbf{x}$ 的概率密度（$\boldsymbol{\theta}$ 视为**非随机**的未知量）。

> **定义 8.1**（似然函数 / Likelihood Function）：
>
> $$
> L(\boldsymbol{\theta}) = p(\mathbf{x};\boldsymbol{\theta}),
> $$
>
> 即把概率密度视为未知参数 $\boldsymbol{\theta}$ 的函数（观测 $\mathbf{x}$ 固定）。

> **定义 8.2**（最大似然估计 / ML Estimate）：
>
> $$
> \hat{\boldsymbol{\theta}}_{ML} = \arg\max_{\boldsymbol{\theta}}\; p(\mathbf{x};\boldsymbol{\theta}).
> $$
>
> ML 准则选取"最可能产生观测数据"的参数值：若参数 $\boldsymbol{\theta}_1$ 比 $\boldsymbol{\theta}_2$ 产生当前观测的概率更高，则 $\boldsymbol{\theta}_1$ 更可能是真实值。这是最直观的推理方式。在大样本极限下，ML 估计是渐近有效且一致的（方差趋于 CRB）。

**最大后验估计（MAP）。** 当参数 $\boldsymbol{\theta}$ 本身是**随机变量**、具有先验分布 $p(\boldsymbol{\theta})$ 时，最大化**后验概率**（由贝叶斯公式 $p(\boldsymbol{\theta}|\mathbf{x}) \propto p(\mathbf{x}|\boldsymbol{\theta})p(\boldsymbol{\theta})$）：

$$
\hat{\boldsymbol{\theta}}_{MAP} = \arg\max_{\boldsymbol{\theta}}\; \left[\ln p(\mathbf{x}|\boldsymbol{\theta}) + \ln p(\boldsymbol{\theta})\right].
$$

MAP 与 ML 的区别在于是否利用参数的先验知识：ML 只利用观测数据，MAP 额外利用先验；当先验为均匀分布时（$\ln p(\boldsymbol{\theta})$ 为常数），**MAP 退化为 ML**。

**克拉美劳界（CRB）。** 无论采用何种估计算法，无偏估计的方差都不可能无限小。

> **定义 8.3**（Fisher 信息矩阵 / FIM）：
>
> $$
> [\mathbf{J}]_{ij} = -E\left[\frac{\partial^2 \ln p(\mathbf{x};\boldsymbol{\theta})}{\partial \theta_i\,\partial\theta_j}\right].
> $$
>
> Fisher 信息矩阵度量了对数似然函数在真实参数附近的**曲率**——曲率越大，说明参数的一个小变化引起的观测分布变化越明显，参数越"可辨识"。

> **定理 8.1**（Cramér–Rao 下界 / CRB）：对任何无偏估计 $\hat{\theta}_i$，
>
> $$
> \mathrm{Var}(\hat{\theta}_i) \ge [\mathbf{J}^{-1}]_{ii} = \mathrm{CRB}(\theta_i).
> $$

**CRB 的三大作用。** (1) 它是**性能基准**——某算法的方差接近 CRB 即为好算法；(2) 它指导**系统设计**——告诉我们为达到所需精度需要多少 SNR 与快拍；(3) 它揭示**不可辨识性**——若 CRB 发散（Fisher 信息矩阵奇异），参数在原理上不可估计。

---

## 8.2 参数估计模型

### 8.2.1 多平面波模型

这是第 8、9 两章的基本模型。

> **定义 8.4**（多平面波快照模型）：
>
> $$
> \mathbf{x}(k) = \mathbf{V}(\boldsymbol{\psi})\,\mathbf{f}(k) + \mathbf{n}(k), \quad k = 1,2,\ldots,K,
> $$
>
> 其中 $\mathbf{x}(k)$ 为 $N \times 1$ 快拍矢量，$\boldsymbol{\psi}=[\psi_1,\ldots,\psi_D]^T$ 为 $D$ 个信号的波数，$\mathbf{V}(\boldsymbol{\psi}) = [\mathbf{v}(\psi_1),\ldots,\mathbf{v}(\psi_D)]$ 为 $N \times D$ 阵列流形矩阵，$\mathbf{f}(k)$ 为 $D \times 1$ 源信号矢量，$\mathbf{n}(k)$ 为 $N \times 1$ 噪声矢量，满足 $E[\mathbf{n}\mathbf{n}^H] = \sigma_w^2\mathbf{I}$。

### 8.2.2 四种信号模型

待估参数 $\boldsymbol{\psi}$ 固定，但对源信号 $\mathbf{f}(k)$ 的统计假设不同，形成四种模型：

**表 8.2** 四种信号模型（S1–S4）

| 模型 | 信号 $\mathbf{f}(k)$ | 谱矩阵 $\mathbf{S}_f$ | 噪声 $\sigma_w^2$ |
| --- | --- | --- | --- |
| S1 | 高斯随机过程 | 未知（$D \times D$） | 已知或未知 |
| S2 | 高斯随机过程 | 未知但**不相关**（对角） | 已知或未知 |
| S3 | **未知非随机**（确定性） | 不存在 | 已知或未知 |
| S4 | 已知波形（如训练序列） | 已知 | 已知或未知 |

**区分模型的意义。** 模型决定了 CRB 的紧度与 ML 的形式：
- **S1（随机、相关）**：信号间允许相关性（如多径），最一般的情形，CRB 最大；
- **S2（随机、不相关）**：信号相互独立，有额外的先验信息，CRB 更小；
- **S3（确定性）**：信号未知但非随机，是"最坏情况"，其条件 ML 的 CRB 通常大于 S1 的随机 CRB；
- **S4（已知波形）**：信号波形已知，只需估计 DOA 与复振幅，信息最多、CRB 最小，估计可降维处理。

---

## 8.3 克拉美劳界（CRB）

### 8.3.1 信号谱未知的高斯模型（S1, N2）

最一般的情形：信号为高斯随机过程，谱矩阵 $\mathbf{S}_f$ 与噪声功率 $\sigma_w^2$ 均未知。参数矢量为
$$
\boldsymbol{\theta} = \left[\boldsymbol{\psi}^T,\ \mathrm{vec}(\mathbf{S}_f)^T,\ \sigma_w^2\right]^T.
$$

> **定理 8.2**（Stoica–Nehorai S1 CRB）：对上述模型，DOA 参数的 CRB 为
>
> $$
> \mathrm{CRB}(\psi_i) = \frac{\sigma_w^2}{2K} \left\{ \mathrm{Re}\!\left[ (\mathbf{D}^H \mathbf{P}_V^\perp \mathbf{D}) \odot \left(\mathbf{S}_f \mathbf{V}^H \mathbf{R}_x^{-1} \mathbf{V} \mathbf{S}_f\right)^T \right] \right\}^{-1}_{ii},
> $$
>
> 其中 $\mathbf{D} = [\mathrm{d}\mathbf{v}(\psi_1)/\mathrm{d}\psi_1, \ldots, \mathrm{d}\mathbf{v}(\psi_D)/\mathrm{d}\psi_D]$ 为流形导数矩阵，$\mathbf{P}_V^\perp = \mathbf{I} - \mathbf{V}(\mathbf{V}^H\mathbf{V})^{-1}\mathbf{V}^H$ 为到信号子空间正交补的投影，$\odot$ 为 Hadamard 积，$\mathbf{R}_x = \mathbf{V}\mathbf{S}_f\mathbf{V}^H + \sigma_w^2\mathbf{I}$。

该式形式复杂，但物理意义清晰：
$$
\mathrm{CRB} \;\propto\; \frac{\sigma_w^2}{2K} \times \frac{1}{\text{信号能量在导数方向上的投影}}.
$$
三点直观结论：噪声功率 $\sigma_w^2$ 越大，界越高；快拍数 $K$ 越大，界越低（数据越多越准）；分母越大，界越低——阵列流形对参数变化越敏感（导数能量越大），参数越容易估计。

### 8.3.2 单信号情形

只有一个信号时，CRB 简化为闭式：

> **定理 8.3**（单信号 CRB）：
>
> $$
> \mathrm{CRB}(\psi) = \frac{\sigma_w^2}{2K\,S_f} \cdot \frac{1 + ASNR}{ASNR} \cdot \frac{1}{\|\mathbf{d}\|^2 - \dfrac{|\mathbf{d}^H\mathbf{v}|^2}{N}},
> $$
>
> 其中 $ASNR = N\,S_f/\sigma_w^2$ 为阵列信噪比，$\mathbf{d} = \mathrm{d}\mathbf{v}(\psi)/\mathrm{d}\psi$ 为单信号导数矢量。注意分子中的 $1/S_f$ 因子由 Stoica–Nehorai 通式中的 $(\mathbf{S}_f \mathbf{V}^H \mathbf{R}_x^{-1}\mathbf{V} \mathbf{S}_f)$ 在单信号情形退化而来，不可省略。

**两种极限。** 高 SNR（$ASNR \gg 1$）时：
$$
\mathrm{CRB} \approx \frac{\sigma_w^2}{2K\,S_f}\cdot\frac{1}{\|\mathbf{d}\|^2 - |\mathbf{d}^H\mathbf{v}|^2/N},
$$
CRB 与 SNR **成反比**（无饱和）——误差的系数由阵列流形的曲率 $\|\mathbf{d}\|^2$ 决定，提升信噪比持续改善估计精度。低 SNR（$ASNR \ll 1$）时：
$$
\mathrm{CRB} \approx \frac{\sigma_w^4}{2K\,N\,S_f^2}\cdot\frac{1}{\|\mathbf{d}\|^2 - |\mathbf{d}^H\mathbf{v}|^2/N},
$$
CRB 与 SNR 的**平方成反比**——低信噪比下估计精度随 SNR 的下降恶化得更快。

**标准线阵的标度律。** 对标准均匀线阵，
$$
\|\mathbf{d}\|^2 = \frac{N(N^2-1)}{12}\left(\frac{2\pi}{\lambda}\right)^2,
$$
代入并归一化到波数空间得（高 SNR 渐近）
$$
\mathrm{CRB}(\psi) \approx \frac{6}{K\,ASNR\,N^2} = \frac{6\sigma_w^2}{K\,N^3\,S_f}.
$$
由于 $ASNR \propto N$ 且 $\|\mathbf{d}\|^2 \propto N^3$，**CRB 与 $N^3$ 成反比**——阵元越多，DOA 估计越准，这是阵列孔径价值的定量体现。

![图 8.1：单信号 CRB——高 SNR 时与 SNR 成反比（无饱和）、极低 SNR 时与 SNR² 成反比；随阵元数 N 以 ∝1/N³ 下降。](../pic/ch8_单信号CRB.png)

### 8.3.3 两个不相关信号

两信号不相关时 $\mathbf{S}_f = \mathrm{diag}(P_1, P_2)$。对标准线阵，CRB 近似为

> **定理 8.4**（两不相关信号 CRB）：
>
> $$
> \mathrm{CRB}(\psi_i) \approx \frac{6}{2K\,ASNR_i\,N^2} \cdot \frac{1}{1 - \left|\dfrac{\sin(N\pi\Delta u/2)}{N\sin(\pi\Delta u/2)}\right|^2},
> $$
>
> 其中 $\Delta u = |\psi_1-\psi_2|/\pi$ 为两信号的归一化间隔。

第二项因子揭示**分辨极限**：当间隔大于波束宽度（$\Delta u > 2/N$）时，$\sin(N\pi\Delta u/2)/(N\sin(\pi\Delta u/2))$ 是 Dirichlet 核 $|B(\Delta u)|$，其值小，因子接近 1，CRB 与单信号相同；当间隔很小、两信号落入同一主瓣内时，$|B(\Delta u)|\to 1$，因子 $\gg 1$，CRB 急剧增大——**两信号靠得越近越难分辨**。CRB 因此定量刻画了阵列的角度分辨能力。

![图 8.2：两个不相关信号的 CRB vs 间隔 Δu——间隔小于波束宽度时分辨因子 1/(1−|B|²) 使 CRB 急剧增大。](../pic/ch8_双信号CRB.png)

### 8.3.4 相关信号

信号相关（$|\rho|>0$）时 CRB 通常**增大**。一个关键结论：对**共轭对称阵列**（如标准线阵），CRB 在相关系数相位 $\phi_\rho = 0$ 或 $\pi$ 时**最大**，在 $\phi_\rho = \pi/2$ 时**最小**。

**物理解释。** 同相相关（$\phi_\rho = 0$）时两个信号在复数域"像同一个信号"，难以分辨；正交相关（$\phi_\rho = \pi/2$）时两信号在复数域正交，容易分辨。对**相干信号**（$|\rho|=1$）：$\phi_\rho = 0$ 时 CRB 发散（不可辨识），$\phi_\rho = \pi/2$ 时 CRB 有限（复数域可区分）。这正是空间平滑（前后向 FB 平均）能在相干信号环境下奏效的原因——它通过子阵平均有效地改变了信号间的相对相位，从而避开 $\phi_\rho=0$ 的退化情形。

### 8.3.5 不相关信号模型（S2）

若已知信号互不相关，$\mathbf{S}_f$ 为对角矩阵，此先验信息使 CRB 比 S1 情形**更小**。实际意义：当已知到达信号来自不同发射机（不相关）时，可用更紧的 S2 CRB；否则保守地采用 S1 的 CRB。

---

## 8.4 最大似然估计

ML 估计是达到 CRB 的"最优"估计。按信号模型分为随机信号的渐近 ML（AML）与确定性信号的条件 ML（CML），并引入其高 SNR 近似——加权子空间拟合（WSF/MODE）。

### 8.4.1 渐近最大似然（AML）

**问题。** 信号 $\mathbf{f}(k)$ 为高斯随机过程，$\mathbf{S}_f$ 与 $\sigma_w^2$ 未知。负对数似然为
$$
L(\boldsymbol{\psi}, \mathbf{S}_f, \sigma_w^2) = -\ln\det(\mathbf{R}_x) - \mathrm{tr}\left(\mathbf{R}_x^{-1}\hat{\mathbf{S}}_x\right),
$$
其中 $\mathbf{R}_x = \mathbf{V}\mathbf{S}_f\mathbf{V}^H + \sigma_w^2\mathbf{I}$。

**Jaffer 化简。** 先固定 $\boldsymbol{\psi}$，对 $\mathbf{S}_f$ 与 $\sigma_w^2$ 求 ML 解：
$$
\hat{\mathbf{S}}_f(\boldsymbol{\psi}) = (\mathbf{V}^H\mathbf{V})^{-1}\mathbf{V}^H\!\left(\hat{\mathbf{S}}_x - \hat{\sigma}_w^2\mathbf{I}\right)\mathbf{V}\,(\mathbf{V}^H\mathbf{V})^{-1},
$$
$$
\hat{\sigma}_w^2(\boldsymbol{\psi}) = \frac{1}{N-D}\,\mathrm{tr}\left(\mathbf{P}_V^\perp \hat{\mathbf{S}}_x\right),
$$
代回似然函数得到**压缩的 AML 代价函数**（只含 $\boldsymbol{\psi}$）：

> **定理 8.5**（AML 代价函数）：
>
> $$
> \hat{\boldsymbol{\psi}}_{AML} = \arg\max_{\boldsymbol{\psi}}\left[ -\ln\det\!\left(\mathbf{P}_V \hat{\mathbf{S}}_x \mathbf{P}_V + \hat{\sigma}_w^2 \mathbf{P}_V^\perp\right) - \frac{1}{\hat{\sigma}_w^2}\mathrm{tr}\left(\mathbf{P}_V^\perp \hat{\mathbf{S}}_x\right) \right].
> $$

AML 的解析解把 $(\boldsymbol{\psi},\mathbf{S}_f,\sigma_w^2)$ 的高维优化降为**只对 $\boldsymbol{\psi}$** 的优化，且渐近达到 S1 情形的 CRB。

### 8.4.2 条件最大似然（CML）

**问题。** 信号 $\mathbf{f}(k)$ 为**未知非随机**（确定性）参数。负对数似然为
$$
L(\boldsymbol{\psi}, \mathbf{f}) = -\frac{1}{\sigma_w^2}\sum_{k=1}^{K}\left\|\mathbf{x}(k) - \mathbf{V}(\boldsymbol{\psi})\mathbf{f}(k)\right\|^2.
$$
对 $\mathbf{f}(k)$ 求 ML 得最小二乘解 $\hat{\mathbf{f}}(k) = (\mathbf{V}^H\mathbf{V})^{-1}\mathbf{V}^H\mathbf{x}(k) = \mathbf{V}^\dagger\mathbf{x}(k)$，代入得压缩代价：

> **定理 8.6**（CML 代价函数）：
>
> $$
> \hat{\boldsymbol{\psi}}_{CML} = \arg\min_{\boldsymbol{\psi}}\; \mathrm{tr}\left(\mathbf{P}_V^\perp \hat{\mathbf{S}}_x\right).
> $$

**几何解释。** 由投影性质 $\mathrm{tr}(\mathbf{P}_V^\perp\hat{\mathbf{S}}_x) = \sum_k\|\mathbf{P}_V^\perp\mathbf{x}(k)\|^2$，CML 找到使观测数据在信号子空间正交补上的**投影能量最小**的 $\boldsymbol{\psi}$——数据应尽量落在信号子空间内，落在其外的能量越小，$\boldsymbol{\psi}$ 越合理。

**CML 的性能损失。** 确定性模型下 CML 渐近达不到随机模型的 CRB，存在信噪比相关的损失：
$$
\frac{\mathrm{Var}_{CML}}{\mathrm{CRB}} \approx 1 + \frac{1}{ASNR}.
$$
高 SNR 时 AML 与 CML 几乎一致；低 SNR 时 AML 更优但计算更复杂。

**表 8.3** AML 与 CML 对比

| 特性 | AML | CML |
| --- | --- | --- |
| 信号模型 | 高斯随机（S1/S2） | 未知确定性（S3） |
| 代价函数 | $\ln\det(\cdot) + \mathrm{tr}(\cdot)$ | $\mathrm{tr}(\mathbf{P}_V^\perp \hat{\mathbf{S}}_x)$ |
| 渐近性能 | 达到 S1 CRB | 达不到 CRB（损失约 $1+1/ASNR$） |
| 计算复杂度 | 较高 | 较低 |
| 对相关信号 | 鲁棒 | 可能失效 |

### 8.4.3 加权子空间拟合（WSF/MODE）

CML 的代价可写成特征值形式：
$$
\mathrm{tr}\left(\mathbf{P}_V^\perp \hat{\mathbf{S}}_x\right) = \sum_{i=D+1}^{N}\lambda_i,
$$
即**平等对待所有噪声特征值**。若对不同特征值赋予不同权重，可得到加权子空间拟合（WSF）：
$$
\mathrm{WSF} = \mathrm{tr}\left(\mathbf{P}_V^\perp \hat{\mathbf{U}}_s \mathbf{W} \hat{\mathbf{U}}_s^H\right),
$$
其中 $\hat{\mathbf{U}}_s$ 为信号子空间特征矢量矩阵，$\mathbf{W}$ 为加权矩阵。最优加权为
$$
\mathbf{W} = \mathbf{\Lambda}_s - \sigma_w^2\mathbf{I}, \qquad \mathbf{\Lambda}_s = \mathrm{diag}(\lambda_1,\ldots,\lambda_D),
$$
该选择即**MODE（方向估计方法）**，是 CML 的高 SNR 近似，渐近性能接近最优。

![图 8.3：AML 与 CML 的估计方差 vs SNR——高 SNR 时两者趋同且逼近 CRB，低 SNR 时 AML 优于 CML。](../pic/ch8_AML_CML对比.png)

---

## 8.5 计算方法

ML 估计需要在 $D$ 维参数空间搜索，$D$ 为信号个数；$D\ge 3$ 时直接网格搜索不可行，需要迭代方法。

### 8.5.1 优化方法（梯度法）

在 $\hat{\boldsymbol{\psi}}$ 附近，代价函数 $F(\boldsymbol{\psi})$ 作二次近似：
$$
F(\boldsymbol{\psi}) \approx F(\boldsymbol{\psi}_0) + \mathbf{g}^T(\boldsymbol{\psi}-\boldsymbol{\psi}_0) + \frac{1}{2}(\boldsymbol{\psi}-\boldsymbol{\psi}_0)^T\mathbf{H}(\boldsymbol{\psi}-\boldsymbol{\psi}_0),
$$
其中 $\mathbf{g} = \nabla F$ 为梯度、$\mathbf{H}$ 为 Hessian 矩阵。**牛顿法**迭代
$$
\boldsymbol{\psi}_{k+1} = \boldsymbol{\psi}_k - \mu_k \mathbf{H}^{-1}\mathbf{g}
$$
收敛快（二次收敛），但需计算 Hessian 且当其非正定时可能发散。**得分法（Fisher Scoring）** 用 CRB 的逆代替 Hessian——渐近等价、数值更稳定。

### 8.5.2 交替投影（AP）

**核心思想。** 把 $D$ 维优化分解为 $D$ 个**一维优化**交替进行。对 CML：
$$
\hat{\psi}_i^{(k+1)} = \arg\max_{\psi_i}\; \mathrm{tr}\!\left(\mathbf{P}_{V\left(\hat{\boldsymbol{\psi}}_{(i)}^{(k)},\,\psi_i\right)}\hat{\mathbf{S}}_x\right),
$$
其中 $\hat{\boldsymbol{\psi}}_{(i)}^{(k)}$ 为第 $k$ 次迭代中除第 $i$ 个参数外其余参数的当前估计。每次只做一个一维穷举扫描，代价低，反复迭代可达整体最优；初始化可用常规波束形成或 MUSIC 的粗略估计。

### 8.5.3 EM 算法（期望最大化）

**核心思想。** 若"完全数据"（每个信号源的独立观测 $\mathbf{y}_i(k)$）可观测，问题退化为各信号独立的一维估计。EM 用当前估计填充缺失数据再重新估计：

- **E 步**（期望）：用当前 $\hat{\boldsymbol{\psi}}$ 求 $\hat{\mathbf{y}}_i(k) = E[\mathbf{y}_i(k)\,|\,\mathbf{x}(k), \hat{\boldsymbol{\psi}}]$；
- **M 步**（最大化）：$\hat{\psi}_i^{(k+1)} = \arg\max_{\psi_i} \sum_k \left|\mathbf{v}^H(\psi_i)\hat{\mathbf{y}}_i(k)\right|^2$，即一次**一维常规波束扫描**。

EM 的优雅之处在于每个 M 步都只需一维扫描、计算简单，但收敛速度慢于交替投影。

---

## 8.6 多项式参数化（标准线阵）

### 8.6.1 范德蒙结构动机

标准线阵的阵列流形为范德蒙矢量 $\mathbf{v}(\psi) = [1,\,e^{j\psi},\,\ldots,\,e^{j(N-1)\psi}]^T$。信号子空间与噪声子空间的正交性等价于：存在一个 $D$ 阶多项式，其零点恰在 $e^{j\psi_i}$ 处。从而把对连续参数 $\boldsymbol{\psi}$ 的搜索转化为对**多项式系数**的估计。

### 8.6.2 IQML（迭代二次最大似然）

定义多项式
$$
b(z) = z^D + b_1 z^{D-1} + \cdots + b_D = \prod_{i=1}^{D}\left(z - e^{j\psi_i}\right),
$$
则 CML 代价函数可写为系数矢量 $\mathbf{b}$ 的**二次型**：
$$
J(\mathbf{b}) = \mathbf{b}^H \mathbf{Q} \mathbf{b},
$$
其中 $\mathbf{Q}$ 由 $\hat{\mathbf{S}}_x$ 决定。**IQML 迭代**：(1) 初始化 $\mathbf{b}$；(2) 由当前 $\mathbf{b}$ 计算 $\mathbf{Q}$；(3) 在约束 $\|\mathbf{b}\|=1$ 下最小化 $\mathbf{b}^H\mathbf{Q}\mathbf{b}$——解为 $\mathbf{Q}$ 最小特征值对应的特征向量；(4) 重复至收敛。每次迭代仅需一次 $(D+1)$ 维小特征分解，计算量小，性能接近 CML。

### 8.6.3 MODE 的多项式形式

WSF（MODE）同样可写成多项式形式，且**无需迭代**（两步法）：第一步估计信号子空间 $\hat{\mathbf{U}}_s$；第二步由 $\hat{\mathbf{U}}_s$ 直接构造 $\mathbf{Q}_{MODE}$，求解 $\min \mathbf{b}^H\mathbf{Q}_{MODE}\mathbf{b}$。

**表 8.4** IQML 与 MODE 对比

| 特性 | IQML | MODE |
| --- | --- | --- |
| 迭代 | 需要（循环小特征分解） | 非迭代（两步） |
| 性能 | 接近 CML | 接近渐近最优（WSF） |
| 计算量 | 每次迭代 $O((D+1)^3)$ | 一次 $(D+1)$ 维分解 |

---

## 8.7 信号数检测

ML 估计要求已知信号个数 $D$——$D$ 不对则估计结果失去意义，故信号数检测是估计的**先决条件**。第 7.8 节已给出两种信息准则：**AIC** 过估计概率高（保守），**MDL** 为一致估计（$K\to\infty$ 时以概率 1 收敛到真实 $D$）。

若 $D$ 未知，可在 ML 代价函数中加入对 $D$ 的惩罚项，进行**联合检测与估计**：
$$
\left(\hat{D},\ \hat{\boldsymbol{\psi}}\right) = \arg\max_{D,\boldsymbol{\psi}}\; \left[ L(\hat{\boldsymbol{\psi}}, D) - \text{惩罚}(D) \right],
$$
即 MDL 原理在阵列处理中的直接应用——用似然最大化拟合数据，用惩罚项控制模型复杂度（避免过估计）。

---

## 8.8 空间扩展信号

前面假设理想平面波；空间扩展信号来自一个**连续区域**（如对流层散射通信、分布式目标），其空间谱 $S(\psi)$ 为连续函数，需用参数描述（如中心角 + 扩展宽度）。

**CRB 的变化。** 扩展宽度增大使 CRB 增大（方向不再明确）；若忽略扩展、强行用平面波模型估计，会产生**系统性偏差**。ML 估计需把扩展参数（如标准差）纳入待估参数，计算更复杂。

---

## 8.9 波束空间参数估计

**动机。** 先在波束空间降维（$N \to N_{bs}$）再估计，好处有三：维数降低、计算量减小、波束区域外的干扰被预先抑制。

**信息损失。** 波束空间 CRB 不小于阵元空间 CRB（降维损失信息）。但若波束空间矩阵选取得当（如用 DFT 波束覆盖信号所在区域），损失可以忽略——这是实际系统中的常用预处理技巧。

---

## 8.10 敏感度、稳健性与校正

### 8.10.1 模型失配

实际阵列总存在误差：阵元位置误差、增益/相位误差。这些失配使 DOA 估计产生**偏差且方差增大**，理论上的最优性被破坏。

### 8.10.2 混合 CRB

把未知的阵列参数 $\mathbf{p}$（具有先验分布）与 DOA $\boldsymbol{\psi}$ 联合考虑，可得**混合 CRB**：
$$
\mathrm{CRB}_{hybrid}(\boldsymbol{\psi}) = \left[\mathbf{J}_{\psi\psi} - \mathbf{J}_{\psi p}\,\mathbf{J}_{pp}^{-1}\,\mathbf{J}_{p\psi}\right]^{-1},
$$
其中第二项反映了阵列参数不确定对 DOA 估计 CRB 的**抬升**：$\mathbf{J}_{\psi p}\,\mathbf{J}_{pp}^{-1}\mathbf{J}_{p\psi}$ 越大，DOA 估计越差。

### 8.10.3 MAP 联合估计（自校准）

同时估计 DOA 与阵列参数：
$$
\left(\hat{\boldsymbol{\psi}},\ \hat{\mathbf{p}}\right) = \arg\max_{\boldsymbol{\psi},\mathbf{p}}\; \left[\ln p(\mathbf{x}\,|\,\boldsymbol{\psi},\mathbf{p}) + \ln p(\mathbf{p})\right],
$$
用信号本身校准阵列（**自校准**），是 MAP 思想在阵列校正中的应用。

---

## 8.11 本章总结

**从模型到估计的完整路径。** 输入 $K$ 个快拍 $\mathbf{x}(k)$ 后：(1) 选择信号模型——随机信号（S1/S2）→ AML，确定性信号（S3）→ CML，已知波形（S4）→ 降维 ML；(2) 以 CRB 作为性能基准；(3) 选择计算方法——梯度法（精确但昂贵）、AP/EM（交替一维搜索、迭代）、多项式法（IQML/MODE，线阵特化）；(4) 输出 DOA 估计 $\hat{\psi}_1,\ldots,\hat{\psi}_D$。

**核心公式对照表**

**表 8.5** 第 8 章核心公式

| 概念 | 公式 | 物理意义 |
| --- | --- | --- |
| 快拍模型 | $\mathbf{x} = \mathbf{V}\mathbf{f} + \mathbf{n}$ | 观测 = 信号 + 噪声 |
| 单信号 CRB | $\mathrm{CRB} \propto \dfrac{1}{K\,SNR\,N^3}$ | 快拍、SNR、阵元越多越好 |
| AML 代价 | $\ln\det(\cdot) + \mathrm{tr}(\cdot)$ | 随机信号的最优估计 |
| CML 代价 | $\mathrm{tr}(\mathbf{P}_V^\perp\hat{\mathbf{S}}_x)$ | 确定性信号的最优估计 |
| CML 损失 | $\mathrm{Var}_{CML}/\mathrm{CRB} \approx 1+1/ASNR$ | 低 SNR 时与最优有差距 |
| IQML/MODE | $\min \mathbf{b}^H\mathbf{Q}\mathbf{b}$ | 线阵的高效 CML/WSF |
| 信号数检测 | $L(d) + \text{惩罚}(d)$ | AIC/MDL 原则 |

**核心结论。** (1) CRB 是任何估计算法方差的下界，是评估性能的基准；(2) ML 选择使观测数据概率最大的参数，大样本下达到 CRB；(3) AML 与 CML 的选择取决于信号是随机还是确定性；(4) ML 的主要挑战是 $D$ 维搜索的计算量，AP、EM、IQML 都是为了降低复杂度；(5) 信号数检测（AIC/MDL）是估计的先决条件；(6) 阵列误差破坏理论最优性，需要稳健性与自校准技术。

**与后续章节的联系。** 第 8 章建立理论基础（最优是什么、极限在哪、如何达到）；第 9 章介绍计算上更简单的实用算法（MUSIC、ESPRIT、最小模等），在典型条件下逼近 CRB。
