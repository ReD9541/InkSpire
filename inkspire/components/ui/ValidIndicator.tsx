import { Ionicons } from "@expo/vector-icons"

export function ValidIndicator ( props:any ) {
    if (props.valid === true) {
    return <Ionicons name="checkmark" size={18} color="lightgreen" />;
  } else if (props.valid === false) {
    return <Ionicons name="close" size={18} color="red" />;
  } else {
    return null;
  }
}