import React from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
} from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

function DiscountTable() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formik = useFormik({
    initialValues: {
      code: "",
      value: "",
      expirationDate: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Discount code is required").uppercase(),
      value: Yup.number().required("Enter discount value").positive(),
      expirationDate: Yup.date().required("Expiration date is required"),
    }),
    onSubmit: (values) => {
        console.log(values)
    },
  });
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">
            Discount List
          </h2>
          <div>
            <div className="relative flex items-center gap-5">
              <Button
                radius="sm"
                color="primary"
                variant="shadow"
                className="outline-none focus:outline-none"
                onPress={onOpen}
              >
                <Plus className="text-white" />
                Add Discount
              </Button>
            </div>
          </div>
        </div>
        {/* discount model */}

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="xs"
          classNames={{
            closeButton: "focus:outline-none",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  Add Discount
                </ModalHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <ModalBody className="gap-0">
                    <div className="mb-2">
                      <Input
                        type="text"
                        label="Discount Code"
                        labelPlacement="outside"
                        name="code"
                        placeholder="SUMMER10"
                        {...formik.getFieldProps("code")}
                        onChange={(e) => formik.setFieldValue("code", e.target.value.toUpperCase())} // Convert to uppercase
                      />
                      {formik.touched.code && formik.errors.code && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.code}
                        </p>
                      )}
                    </div>
                    <div className="mb-2">
                      <Input
                        type="number"
                        label="Discount Value"
                        labelPlacement="outside"
                        placeholder="10-50"
                        name="value"
                        {...formik.getFieldProps("value")}
                      />
                      {formik.touched.value && formik.errors.value && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.value}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="font-medium">Expiration Date</label>
                      <Input
                        type="date"
                        name="expirationDate"
                        {...formik.getFieldProps("expirationDate")}
                      />
                      {formik.touched.expirationDate &&
                        formik.errors.expirationDate && (
                          <p className="text-red-500 text-sm">
                            {formik.errors.expirationDate}
                          </p>
                        )}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="secondary" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit" color="success">Add Discount</Button>
                    </div>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </motion.div>
    </>
  );
}

export default DiscountTable;
