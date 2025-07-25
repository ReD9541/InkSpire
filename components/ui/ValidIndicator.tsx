import { Ionicons } from "@expo/vector-icons"
import FontAwesome from '@expo/vector-icons/FontAwesome';

export function ValidIndicator ( props:any ) {
    if (props.valid === true) {
    return <Ionicons name="checkmark" size={18} color="lightgreen" />;
  } else if (props.valid === false) {
    return <FontAwesome name="close" size={24} color="red" />

  } else {
    return null;
  }
}