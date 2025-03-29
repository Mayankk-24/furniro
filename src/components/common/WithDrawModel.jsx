import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "sonner";
import auth from "@/utils/Auth";
import axios from 'axios';

let url = import.meta.env.VITE_PUBLIC_URL;
function WithDrawModel({ isOpen, onOpenChange }) {
  const onSubmit = async (values) => {
    console.log(values);
    const authToken = await auth();
    try {
      const res = await axios.post(`${url}billing/refund`, values, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
        },
      });
      if (res.status == 200) {
        toast.success("Withdrawal successful");
        onOpenChange(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      accountNumber: "",
      bankName: "",
      reason: "",
    },
    onSubmit,
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(1000, "add more than 1000 rupee")
        .required("Amount is required!"),
      accountNumber: Yup.string().required("Account number is required!"),
      bankName: Yup.string().required("Bank name is required!"),
      reason: Yup.string().required("Reason is required!"),
    }),
  });
  return (
    <>
      <div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="sm"
          classNames={{
            closeButton: "focus:outline-none",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  Withdraw Money{" "}
                  <Icon icon="emojione:money-bag" width="30" height="30" />
                </ModalHeader>
                <form onSubmit={formik.handleSubmit}>
                  <ModalBody className="gap-0">
                    <Input
                      label="Reason"
                      type="text"
                      name="reason"
                      variant="bordered"
                      {...formik.getFieldProps("reason")}
                      labelPlacement="outside"
                      placeholder="Enter Your Reason"
                      isInvalid={
                        formik.touched.reason && Boolean(formik.errors.reason)
                      }
                    />
                    {formik.touched.reason && formik.errors.reason && (
                      <div className="text-xs text-[#FF5630] font-medium px-2 pt-2">
                        {formik.errors.reason}
                      </div>
                    )}
                    <Input
                      label="Amount"
                      type="number"
                      name="amount"
                      variant="bordered"
                      {...formik.getFieldProps("amount")}
                      endContent={
                        <FaIndianRupeeSign size={14} className="mr-1" />
                      }
                      labelPlacement="outside"
                      placeholder="Enter Your Amount"
                      isInvalid={
                        formik.touched.amount && Boolean(formik.errors.amount)
                      }
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <div className="text-xs text-[#FF5630] font-medium px-2 pt-2">
                        {formik.errors.amount}
                      </div>
                    )}
                    <Input
                      label="Bank Name"
                      type="text"
                      name="bankName"
                      variant="bordered"
                      {...formik.getFieldProps("bankName")}
                      labelPlacement="outside"
                      placeholder="Enter Your Bank name"
                      isInvalid={
                        formik.touched.bankName &&
                        Boolean(formik.errors.bankName)
                      }
                    />
                    {formik.touched.bankName && formik.errors.bankName && (
                      <div className="text-xs text-[#FF5630] font-medium px-2 pt-2">
                        {formik.errors.bankName}
                      </div>
                    )}
                    <Input
                      label="Bank Account Number"
                      type="text"
                      name="accountNumber"
                      variant="bordered"
                      {...formik.getFieldProps("accountNumber")}
                      labelPlacement="outside"
                      placeholder="Enter Your Bank account number"
                      isInvalid={
                        formik.touched.accountNumber &&
                        Boolean(formik.errors.accountNumber)
                      }
                    />
                    {formik.touched.accountNumber &&
                      formik.errors.accountNumber && (
                        <div className="text-xs text-[#FF5630] font-medium px-2 pt-2">
                          {formik.errors.accountNumber}
                        </div>
                      )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="submit"
                      color="primary"
                      className="focus:outline-none"
                      isLoading={formik.isSubmitting}
                    >
                      Transfer now
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default WithDrawModel;
