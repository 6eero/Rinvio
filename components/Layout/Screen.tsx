import { Colors, Layout } from "@/constants/theme";
import { BottomTabBarHeightContext } from "expo-router/tabs";
import { ReactNode, useContext } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PageTitle from "./PageTitle";

type ScreenProps = {
  title?: string;
  headerRight?: ReactNode;
  /** Replaces the title row (e.g. with a search field). */
  header?: ReactNode;
  /** Wrap the content in a keyboard-aware ScrollView (default: true). */
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Base container for every screen. It owns:
 * - safe area insets (top/sides always, bottom only outside the tab navigator,
 *   where the tab bar already reserves it)
 * - the page title
 * - scrolling, keeping the focused input visible above the keyboard
 */
export default function Screen({
  title,
  headerRight,
  header,
  scrollable = true,
  contentContainerStyle,
  children,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  // undefined when the screen is not rendered inside the tab navigator
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const bottomInset = tabBarHeight === undefined ? insets.bottom : 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.header,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {header ??
        (title && <PageTitle title={title}>{headerRight}</PageTitle>)}

      {scrollable ? (
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: Colors.background }}
          contentContainerStyle={[
            {
              flexGrow: 1,
              padding: Layout.padding,
              paddingBottom: Layout.padding + bottomInset,
            },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          bottomOffset={Layout.padding}
          // the keyboard also covers the tab bar, so don't count it twice
          extraKeyboardSpace={-(tabBarHeight ?? 0)}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View
          style={[
            {
              flex: 1,
              backgroundColor: Colors.background,
              paddingBottom: bottomInset,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}
