'use client'

import React from "react";
import { useRouter } from "next/navigation";

export default function CarePlanCreate4Page(props: any) {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="flex flex-col items-start self-stretch bg-white"
        style={{
          boxShadow: "0px 4px 4px #00000040"
        }}>
        <div className="relative flex items-center justify-between self-stretch bg-white py-[22px] px-[34px] mt-[54px] mb-[1px]">
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/oclqgrap_expires_30_days.png"}
            className="w-[5px] h-2.5 object-fill cursor-pointer z-10"
            onClick={() => router.back()}
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#646464] text-lg font-bold" >
            {"검증 결과"}
          </span>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/1b7go0lm_expires_30_days.png"}
            className="w-[18px] h-5 object-fill z-10"
          />
        </div>
        <img
          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/9jr70j74_expires_30_days.png"}
          className="self-stretch h-[1px] mb-[27px] object-fill"
        />
        <div className="flex flex-col items-start mb-12 ml-9 gap-1">
          <span className="text-[#353535] text-[28px] font-bold" >
            {"간병인 의견이 도착했어요"}
          </span>
          <span className="text-[#828282] text-base font-bold mr-[82px]" >
            {"AI가 검증한 결과를 확인하세요."}
          </span>
        </div>
        <div className="flex flex-col items-start self-stretch bg-white py-[18px] mb-9 mx-[34px] rounded-lg border border-solid border-[#18D4C6]"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <span className="text-[#353535] text-base font-bold mb-3 ml-5" >
            {"검토 결과 요약"}
          </span>
          <div className="flex items-start self-stretch mb-3 mx-[42px] gap-4">
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <button className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}
                onClick={() => alert("Pressed!")}>
                <span className="text-[#18D4C6] font-bold" >
                  {"9건"}
                </span>
              </button>
              <span className="text-[#828282] text-xs font-bold" >
                {"수용 권장"}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <button className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}
                onClick={() => alert("Pressed!")}>
                <span className="text-[#18D4C6] font-bold" >
                  {"2건"}
                </span>
              </button>
              <span className="text-[#828282] text-xs font-bold" >
                {"부분 수용"}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <button className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}
                onClick={() => alert("Pressed!")}>
                <span className="text-[#18D4C6] font-bold" >
                  {"1건"}
                </span>
              </button>
              <span className="text-[#828282] text-xs font-bold" >
                {"거부 권장"}
              </span>
            </div>
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/8i0h8f1o_expires_30_days.png"}
            className="self-stretch h-[1px] mb-3 mx-[19px] object-fill"
          />
          <div className="flex flex-col items-center self-stretch mb-1">
            <span className="text-[#353535] text-2xl font-bold" >
              {"92/100"}
            </span>
          </div>
          <div className="flex flex-col items-center self-stretch">
            <span className="text-[#828282] text-xs" >
              {"검토 결과 요약"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start self-stretch bg-white py-[18px] pr-[19px] mb-6 mx-[34px] gap-3 rounded-lg"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <div className="flex items-center ml-[19px] gap-[7px]">
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/fru6k15a_expires_30_days.png"}
              className="w-2.5 h-2.5 object-fill"
            />
            <span className="text-[#353535] text-base font-bold" >
              {"수용 권장"}
            </span>
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/x8xix5b3_expires_30_days.png"}
            className="self-stretch h-[1px] ml-[19px] object-fill"
          />
          <div className="flex flex-col items-start self-stretch bg-[#F8F8F8] py-3 ml-[19px] rounded-[5px]">
            <span className="text-[#353535] text-sm font-bold ml-[17px]" >
              {"기존 일정"}
            </span>
            <div className="flex flex-col items-start ml-[17px]">
              <span className="text-[#828282] text-xs mr-[79px]" >
                {"08:00 약 복용 확인"}
              </span>
              <span className="text-[#828282] text-xs" >
                {"아스피린 100g, 메트포르민 500mg"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start self-stretch bg-[#F2FFFE] py-[13px] pr-[17px] ml-[19px] rounded-[5px] border border-solid border-[#18D4C6]">
            <span className="text-[#353535] text-sm font-bold mb-1 ml-[17px]" >
              {"간병인 의견"}
            </span>
            <span className="text-[#828282] text-xs w-[247px] mb-3 ml-[17px]" >
              {"약 복용은 식사 후 30분 뒤에 하는 것이 더 좋습니다.\n메트포르민은 공복에 먹으면 속이 불편할 수 있습니다."}
            </span>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/heauetcg_expires_30_days.png"}
              className="self-stretch h-[1px] mb-3 ml-[17px] object-fill"
            />
            <div className="flex flex-col items-start self-stretch ml-[17px] gap-[5px]">
              <div className="flex items-center gap-1.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/7i2girmr_expires_30_days.png"}
                  className="w-[9px] h-3 object-fill"
                />
                <span className="text-[#FF7E7E] text-xs font-bold" >
                  {"의학적으로 타당한 의견"}
                </span>
              </div>
              <span className="text-[#FF7E7E] text-xs w-[247px]" >
                {"MSD 매뉴얼에 따르면, 메트포르민은 위장 부작용을\n줄이기 위해 식사 중이나 직후에 복용하는 것이 권장됩\n니다."}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start self-stretch bg-[#F2FFFE] py-[11px] ml-[19px] gap-1 rounded-[5px] border border-solid border-[#18D4C6]">
            <span className="text-[#353535] text-sm font-bold ml-[17px]" >
              {"조정 제안"}
            </span>
            <span className="text-[#828282] text-xs ml-[17px]" >
              {"08:30으로 시간 변경 제안"}
            </span>
          </div>
          <div className="flex items-start self-stretch ml-5 gap-2">
            <button className="flex flex-1 flex-col items-center bg-[#18D4C6] text-left py-[11px] rounded-lg border border-solid border-[#18D4C6]"
              onClick={() => alert("Pressed!")}>
              <span className="text-white text-base font-bold" >
                {"수용하기"}
              </span>
            </button>
            <button className="flex flex-1 flex-col items-center bg-[#F2F2F2] text-left py-[11px] rounded-lg border border-solid border-[#828282]"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#828282] text-base font-bold" >
                {"거부하기"}
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start self-stretch bg-white py-[17px] pr-[19px] mb-6 mx-[34px] gap-3 rounded-lg"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <div className="flex items-center ml-5 gap-1.5">
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/vf6dl3fq_expires_30_days.png"}
              className="w-2.5 h-2.5 object-fill"
            />
            <span className="text-[#353535] text-base font-bold" >
              {"부분 수용 권장"}
            </span>
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/aafuitf1_expires_30_days.png"}
            className="self-stretch h-[1px] ml-[19px] object-fill"
          />
          <div className="flex flex-col items-start self-stretch bg-[#F2FFFE] py-3 ml-[19px] rounded-[5px] border border-solid border-[#18D4C6]">
            <span className="text-[#353535] text-sm font-bold mb-1 ml-[17px]" >
              {"간병인 의견"}
            </span>
            <span className="text-[#828282] text-xs mb-3 ml-[17px] mr-[34px]" >
              {"오전에 활동이 너무 집중되어 있어요. 환자분이 쉽게\n피로해하실 수 있으니 휴식 시간을 2시간 늘리세요."}
            </span>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/x11b141z_expires_30_days.png"}
              className="self-stretch h-[1px] mb-3 mx-[17px] object-fill"
            />
            <div className="flex flex-col items-start self-stretch mx-[17px] gap-[5px]">
              <div className="flex items-center gap-1.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/6lt4vtih_expires_30_days.png"}
                  className="w-[9px] h-3 object-fill"
                />
                <span className="text-[#FF7E7E] text-xs font-bold" >
                  {"휴식 필요성은 타당한 의견"}
                </span>
              </div>
              <span className="text-[#FF7E7E] text-xs" >
                {"!! 2시간은 과도함."}
              </span>
              <span className="text-[#FF7E7E] text-xs w-[244px]" >
                {"78세 경도 치매 환자의 경우, 적절한 인지자극은 필요\n합니다. 과도한 휴식은 오히려 인지 기능 저하를 유발\n할 수 있습니다."}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start self-stretch bg-[#F2FFFE] py-[11px] ml-[19px] gap-1 rounded-[5px] border border-solid border-[#18D4C6]">
            <span className="text-[#353535] text-sm font-bold ml-[17px]" >
              {"AI 대안 제안"}
            </span>
            <span className="text-[#828282] text-xs w-[250px] ml-[17px]" >
              {"휴식 시간 1시간 + 가벼운 인지 활동(퍼즐, 이야기 나누\n기 등) 30분 추가"}
            </span>
          </div>
          <div className="flex items-start self-stretch ml-[19px]">
            <button className="flex flex-1 flex-col items-center bg-[#18D4C6] text-left py-[11px] mr-2 rounded-lg border border-solid border-[#18D4C6]"
              onClick={() => alert("Pressed!")}>
              <span className="text-white text-sm font-bold" >
                {"AI 제안 수용"}
              </span>
            </button>
            <button className="flex flex-1 flex-col items-center bg-[#F2F2F2] text-left py-[11px] mr-[9px] rounded-lg border border-solid border-[#828282]"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#828282] text-sm font-bold" >
                {"제안 수용"}
              </span>
            </button>
            <button className="flex flex-1 flex-col items-center bg-[#F2F2F2] text-left py-[11px] rounded-lg border border-solid border-[#828282]"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#828282] text-sm font-bold" >
                {"직접 수정"}
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start self-stretch bg-white py-4 pr-[19px] mb-[95px] mx-[34px] gap-3 rounded-lg"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <div className="flex items-center ml-5 gap-1.5">
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/0ogk9x4u_expires_30_days.png"}
              className="w-2.5 h-2.5 object-fill"
            />
            <span className="text-[#353535] text-base font-bold" >
              {"거부 권장"}
            </span>
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/mey2eydg_expires_30_days.png"}
            className="self-stretch h-[1px] ml-[19px] object-fill"
          />
          <div className="flex flex-col items-start self-stretch bg-[#F2FFFE] py-[13px] ml-[19px] rounded-[5px] border border-solid border-[#18D4C6]">
            <span className="text-[#353535] text-sm font-bold mb-1 ml-[17px]" >
              {"간병인 의견"}
            </span>
            <span className="text-[#828282] text-xs mb-3 ml-[17px]" >
              {"혈압약은 저녁에 복용하는 게 더 효과적입니다."}
            </span>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/kp2hq42i_expires_30_days.png"}
              className="self-stretch h-[1px] mb-3 mx-[17px] object-fill"
            />
            <div className="flex flex-col items-start self-stretch ml-[17px] mr-[31px] gap-[5px]">
              <div className="flex items-center gap-1.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/90bowy8r_expires_30_days.png"}
                  className="w-[9px] h-3 object-fill"
                />
                <span className="text-[#FF7E7E] text-xs font-bold" >
                  {"의학적 근거 불충분"}
                </span>
              </div>
              <span className="text-[#FF7E7E] text-xs w-60" >
                {"환자가 복용 중인 암로디핀은 하루 한 번 아침 복용이\n표준입니다. 야간 저혈압 위험을 피하기 위해 저녁 복\n용은 권장되지 않습니다."}
              </span>
              <span className="text-[#D53D42] text-sm font-bold" >
                {"의사와 상담 후 변경을 권장합니다."}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start self-stretch bg-[#F2FFFE] py-[11px] ml-[19px] gap-1 rounded-[5px] border border-solid border-[#18D4C6]">
            <span className="text-[#353535] text-sm font-bold ml-[17px]" >
              {"AI 대안 제안"}
            </span>
            <span className="text-[#828282] text-xs w-[250px] ml-[17px]" >
              {"휴식 시간 1시간 + 가벼운 인지 활동(퍼즐, 이야기 나누\n기 등) 30분 추가"}
            </span>
          </div>
          <div className="flex items-start self-stretch ml-[19px] gap-2.5">
            <button className="flex flex-1 flex-col items-center bg-[#18D4C6] text-left py-[11px] rounded-lg border border-solid border-[#18D4C6]"
              onClick={() => alert("Pressed!")}>
              <span className="text-white text-base font-bold" >
                {"원안 유지하기"}
              </span>
            </button>
            <button className="flex flex-1 flex-col items-center bg-[#F2F2F2] text-left py-[11px] rounded-lg border border-solid border-[#828282]"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#828282] text-base font-bold" >
                {"그래도 변경"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
