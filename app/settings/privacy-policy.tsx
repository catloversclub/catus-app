import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const PrivacyPolicy = () => {
  return (
    <ScrollView
      className="flex-1 bg-semantic-bg-primary"
      contentContainerClassName="py-10 px-5 gap-6 flex-col"
    >
      <Text className="typo-title2 text-semantic-text-primary">
        CatUs 개인정보 처리방침
      </Text>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제1조 (목적)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          본 약관은 CatUs(이하 “서비스”)이 제공하는 커뮤니티 서비스와 관련하여
          서비스와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제2조 (정의)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          본 약관에서 사용하는 용어의 정의는 다음과 같습니다. {"\n"}1. 이용자:
          본 약관에 동의하고 서비스를 이용하는 회원 {"\n"}2. 회원: 계정을
          생성하여 서비스를 이용하는 자 {"\n"}3. 콘텐츠: 회원이 서비스에 게시한
          게시물, 댓글, 이미지 등 일체의 정보
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제3조 (약관의 효력 및 변경)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 본 약관은 회원 가입 시 동의함으로써 효력이 발생합니다. {"\n"}2.
          서비스는 관련 법령을 위반하지 않는 범위 내에서 약관을 변경할 수
          있습니다. {"\n"}3. 약관 변경 시 사전 공지하며, 변경 후에도 서비스를
          이용할 경우 동의한 것으로 간주합니다.
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제4조 (회원 가입 및 계정 관리)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 회원은 본인 정보를 바탕으로 계정을 생성해야 합니다. {"\n"}2. 회원은
          계정 정보의 정확성과 보안을 유지할 책임이 있습니다. {"\n"}3. 서비스는
          다음의 경우 계정 이용을 제한할 수 있습니다. {"\n"} · 허위 정보 입력{" "}
          {"\n"} · 타인의 권리 침해 {"\n"} · 서비스 운영 방해 행위
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제5조 (콘텐츠의 게시 및 관리)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 회원은 서비스 내에 콘텐츠를 게시할 수 있습니다. {"\n"}2. 콘텐츠의
          저작권은 해당 콘텐츠를 게시한 회원에게 귀속됩니다. {"\n"}3. 서비스는
          다음 콘텐츠를 사전 통보 없이 삭제할 수 있습니다. {"\n"} · 불법 또는
          부적절한 내용 {"\n"} · 타인의 권리를 침해하는 콘텐츠 {"\n"} · 커뮤니티
          운영 정책에 위반되는 경우
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제6조 (콘텐츠 삭제 및 계정 삭제)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 회원이 탈퇴하거나 계정이 삭제될 경우: {"\n"} · 해당 회원이 작성한
          게시물은 삭제됩니다. {"\n"} · 댓글 및 대댓글은 모두 삭제됩니다. {"\n"}
          2. 고양이(Cat)가 삭제되더라도 관련 게시물은 유지될 수 있습니다. {"\n"}
          3. 삭제된 콘텐츠는 복구되지 않습니다.
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제7조 (서비스 이용 제한)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          서비스는 다음 행위가 확인될 경우 서비스 이용을 제한할 수 있습니다.{" "}
          {"\n"} · 불법 행위 {"\n"} · 서비스 시스템 악용 {"\n"} · 반복적인 신고
          누적
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제8조 (책임의 제한)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 서비스는 회원이 게시한 콘텐츠에 대해 책임을 지지 않습니다. {"\n"}2.
          서비스는 천재지변, 시스템 장애 등 불가항력적 사유에 대해 책임을 지지
          않습니다.
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제9조 (준거법 및 관할)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          본 약관은 대한민국 법률을 따르며, 분쟁 발생 시 관할 법원은 서비스 본점
          소재지를 따릅니다.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;
