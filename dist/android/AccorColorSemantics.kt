package com.accor.designsystem.compose

import androidx.compose.runtime.Composable
import com.accor.designsystem.compose.AccorColor.getColor

@Suppress("MagicNumber")
object AccorColorSemantics {

    val brandLogos
        @Composable
        get() = getColor(light = AccorColorPrimitives.Black0, dark = AccorColorPrimitives.NeutralGrey100)
    val loyaltyContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue95, dark = AccorColorPrimitives.Royalblue8)
    val loyaltyContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue86, dark = AccorColorPrimitives.Royalblue20)
    val onLoyaltyContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue30, dark = AccorColorPrimitives.NeutralGrey100)
    val onLoyaltyContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue30, dark = AccorColorPrimitives.NeutralGrey100)
    val loyalty
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue45, dark = AccorColorPrimitives.Royalblue75)
    val onLoyalty
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.Royalblue8)
    val outlineLoyalty
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue45, dark = AccorColorPrimitives.Royalblue45)
    val primaryContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos98, dark = AccorColorPrimitives.Stratos2)
    val primaryContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos94, dark = AccorColorPrimitives.Stratos13)
    val primary
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos2, dark = AccorColorPrimitives.Stratos96)
    val onPrimary
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos98, dark = AccorColorPrimitives.Stratos2)
    val onPrimaryContainer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos13, dark = AccorColorPrimitives.Tropos94)
    val outlinePrimaryHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos2, dark = AccorColorPrimitives.Stratos96)
    val outlinePrimaryLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos75, dark = AccorColorPrimitives.Stratos75)
    val secondaryContainer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos94, dark = AccorColorPrimitives.Tropos13)
    val onSecondaryContainer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos13, dark = AccorColorPrimitives.Tropos98)
    val outlineSecondary
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos60, dark = AccorColorPrimitives.Tropos60)
    val accentContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Electricblue97, dark = AccorColorPrimitives.Electricblue10)
    val accentContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Electricblue85, dark = AccorColorPrimitives.Electricblue28)
    val onAccentContainer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Electricblue10, dark = AccorColorPrimitives.Electricblue97)
    val accent
        @Composable
        get() = getColor(light = AccorColorPrimitives.Electricblue39, dark = AccorColorPrimitives.Electricblue70)
    val onAccent
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.Electricblue10)
    val outlineAccent
        @Composable
        get() = getColor(light = AccorColorPrimitives.Electricblue39, dark = AccorColorPrimitives.Electricblue70)
    val surface
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.AlphaNavalgrey100)
    val surfaceContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.Navalgrey8)
    val surfaceContainerMid
        @Composable
        get() = getColor(light = AccorColorPrimitives.Grey98, dark = AccorColorPrimitives.Navalgrey14)
    val surfaceContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Grey94, dark = AccorColorPrimitives.Navalgrey20)
    val onSurfaceLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Navalgrey40, dark = AccorColorPrimitives.Grey68)
    val onSurfaceMid
        @Composable
        get() = getColor(light = AccorColorPrimitives.Navalgrey24, dark = AccorColorPrimitives.Grey80)
    val onSurfaceHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Navalgrey14, dark = AccorColorPrimitives.Grey98)
    val outlineLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Grey87, dark = AccorColorPrimitives.Navalgrey40)
    val outlineMid
        @Composable
        get() = getColor(light = AccorColorPrimitives.Grey72, dark = AccorColorPrimitives.Navalgrey60)
    val outlineHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Grey58, dark = AccorColorPrimitives.Navalgrey96)
    val neutralContainer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Grey47, dark = AccorColorPrimitives.Grey87)
    val onNeutralContainer
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.Navalgrey14)
    val dangerContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Strawberry95, dark = AccorColorPrimitives.Strawberry10)
    val dangerContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Strawberry80, dark = AccorColorPrimitives.Strawberry28)
    val onDangerContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Strawberry40, dark = AccorColorPrimitives.Strawberry80)
    val onDangerContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Strawberry33, dark = AccorColorPrimitives.Strawberry80)
    val danger
        @Composable
        get() = getColor(light = AccorColorPrimitives.Strawberry40, dark = AccorColorPrimitives.Strawberry40)
    val onDanger
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.Strawberry95)
    val outlineDanger
        @Composable
        get() = getColor(light = AccorColorPrimitives.Strawberry40, dark = AccorColorPrimitives.Strawberry80)
    val warningContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Yellow97, dark = AccorColorPrimitives.Yellow10)
    val warningContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Yellow90, dark = AccorColorPrimitives.Yellow20)
    val onWarningContainer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Yellow30, dark = AccorColorPrimitives.Yellow85)
    val warning
        @Composable
        get() = getColor(light = AccorColorPrimitives.Yellow85, dark = AccorColorPrimitives.Yellow85)
    val onWarning
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey100, dark = AccorColorPrimitives.AlphaNavalgrey100)
    val outlineWarning
        @Composable
        get() = getColor(light = AccorColorPrimitives.Yellow85, dark = AccorColorPrimitives.Yellow85)
    val successContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Peacockgreen96, dark = AccorColorPrimitives.Peacockgreen10)
    val successContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Peacockgreen75, dark = AccorColorPrimitives.Peacockgreen25)
    val onSuccessContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Peacockgreen39, dark = AccorColorPrimitives.Peacockgreen96)
    val onSuccessContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Peacockgreen30, dark = AccorColorPrimitives.Peacockgreen96)
    val success
        @Composable
        get() = getColor(light = AccorColorPrimitives.Peacockgreen39, dark = AccorColorPrimitives.Peacockgreen39)
    val onSuccess
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.NeutralGrey100)
    val outlineSuccess
        @Composable
        get() = getColor(light = AccorColorPrimitives.Peacockgreen39, dark = AccorColorPrimitives.Peacockgreen75)
    val offerContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia96, dark = AccorColorPrimitives.Fuchsia10)
    val offerContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia89, dark = AccorColorPrimitives.Fuchsia20)
    val onOfferContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia40, dark = AccorColorPrimitives.NeutralGrey100)
    val onOfferContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia28, dark = AccorColorPrimitives.NeutralGrey100)
    val offer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia40, dark = AccorColorPrimitives.Fuchsia76)
    val onOffer
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.Fuchsia10)
    val outlineOffer
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia40, dark = AccorColorPrimitives.Fuchsia40)
    val ecoContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Limegreen95, dark = AccorColorPrimitives.Limegreen15)
    val ecoContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Limegreen75, dark = AccorColorPrimitives.Limegreen28)
    val onEcoContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Limegreen45, dark = AccorColorPrimitives.Limegreen95)
    val onEcoContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Limegreen28, dark = AccorColorPrimitives.Limegreen95)
    val eco
        @Composable
        get() = getColor(light = AccorColorPrimitives.Limegreen45, dark = AccorColorPrimitives.Limegreen45)
    val onEco
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.NeutralGrey100)
    val outlineEco
        @Composable
        get() = getColor(light = AccorColorPrimitives.Limegreen45, dark = AccorColorPrimitives.Limegreen45)
    val familyContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos98, dark = AccorColorPrimitives.Stratos2)
    val familyContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos94, dark = AccorColorPrimitives.Stratos13)
    val onFamilyContainerLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos13, dark = AccorColorPrimitives.Stratos2)
    val onFamilyContainerHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos13, dark = AccorColorPrimitives.Stratos2)
    val family
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos2, dark = AccorColorPrimitives.Stratos96)
    val onFamily
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos98, dark = AccorColorPrimitives.Stratos2)
    val outlineFamily
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos2, dark = AccorColorPrimitives.Stratos96)
    val link
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos36, dark = AccorColorPrimitives.Tropos74)
    val watermark
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey5, dark = AccorColorPrimitives.AlphaNavalgrey5)
    val overlayLow
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey30, dark = AccorColorPrimitives.AlphaNavalgrey30)
    val overlayMid
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey54, dark = AccorColorPrimitives.AlphaNavalgrey54)
    val overlayHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey70, dark = AccorColorPrimitives.AlphaNavalgrey70)
    val overlayMax
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey90, dark = AccorColorPrimitives.AlphaNavalgrey90)
    val shadowDefault
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey5, dark = AccorColorPrimitives.AlphaNavalgrey5)
    val shadowStrong
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey20, dark = AccorColorPrimitives.AlphaNavalgrey20)
    val gradientPrimaryHiStart
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos2, dark = AccorColorPrimitives.NeutralGrey100)
    val gradientPrimaryHiEnd
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos36, dark = AccorColorPrimitives.Stratos90)
    val gradientPrimaryLowStart
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia89, dark = AccorColorPrimitives.Fuchsia89)
    val gradientPrimaryLowEnd
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue86, dark = AccorColorPrimitives.Royalblue86)
    val gradientSecondaryStart
        @Composable
        get() = getColor(light = AccorColorPrimitives.Fuchsia96, dark = AccorColorPrimitives.Fuchsia96)
    val gradientSecondaryEnd
        @Composable
        get() = getColor(light = AccorColorPrimitives.Royalblue92, dark = AccorColorPrimitives.Royalblue92)
    val gradientWhiteMin
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaWhite00, dark = AccorColorPrimitives.AlphaWhite00)
    val gradientWhiteMax
        @Composable
        get() = getColor(light = AccorColorPrimitives.NeutralGrey100, dark = AccorColorPrimitives.NeutralGrey100)
    val gradientBlackMin
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey0, dark = AccorColorPrimitives.AlphaNavalgrey0)
    val gradientBlackMid
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey54, dark = AccorColorPrimitives.AlphaNavalgrey54)
    val gradientBlackHi
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey90, dark = AccorColorPrimitives.AlphaNavalgrey90)
    val gradientBlackMax
        @Composable
        get() = getColor(light = AccorColorPrimitives.AlphaNavalgrey100, dark = AccorColorPrimitives.AlphaNavalgrey100)
    val focus
        @Composable
        get() = getColor(light = AccorColorPrimitives.Tropos49, dark = AccorColorPrimitives.Tropos49)
    val allPrimary
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos2, dark = AccorColorPrimitives.Tropos94)
    val classic
        @Composable
        get() = getColor(light = AccorColorPrimitives.Stratos2, dark = AccorColorPrimitives.Stratos2)
    val silver
        @Composable
        get() = getColor(light = AccorColorPrimitives.Silver50, dark = AccorColorPrimitives.Silver50)
    val gold
        @Composable
        get() = getColor(light = AccorColorPrimitives.Gold61, dark = AccorColorPrimitives.Gold61)
    val platinum
        @Composable
        get() = getColor(light = AccorColorPrimitives.Platinum27, dark = AccorColorPrimitives.Platinum27)
    val diamond
        @Composable
        get() = getColor(light = AccorColorPrimitives.Diamond76, dark = AccorColorPrimitives.Diamond76)
    val limitless
        @Composable
        get() = getColor(light = AccorColorPrimitives.Black0, dark = AccorColorPrimitives.Black0)
}
